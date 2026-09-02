
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Loader2, ChevronRight, Globe, ArrowLeft, Moon, Sun, TrendingUp, Flame, LayoutGrid, Map, CheckCircle, RefreshCcw } from 'lucide-react';
import { analyzeAudio, generateLessonPlan } from './services/geminiService';
import { blobToBase64 } from './services/audioUtils';
import { saveSession, getHistory, deleteSession } from './services/storageService';
import { AppState, AnalysisResponse, UserProfile, SessionRecord } from './types';
import Waveform from './components/Waveform';
import ResultsView from './components/ResultsView';
import PhonemeSelector from './components/PhonemeSelector';
import IPAChart from './components/IPAChart';
import ProgressView from './components/ProgressView';
import Onboarding from './components/Onboarding';

const NATIVE_LANGUAGES = [
  "Spanish", "French", "German", "Chinese", "Japanese", 
  "Korean", "Portuguese", "Russian", "Italian", "Arabic", "Hindi", "Turkish", "Vietnamese", "English"
];

const TARGET_LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Japanese", "Portuguese", "Chinese"
];

const TARGET_ACCENTS = [
  "General American",
  "British (RP)",
  "Australian",
  "Neutral International",
  "American Southern"
];

type TabMode = 'quick' | 'phoneme' | 'progress';
type PhonemeViewMode = 'list' | 'chart';

export default function App() {
  // Onboarding State
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
    if (localStorage.getItem('slang_onboarded') === 'true') return true;
    if (localStorage.getItem('linguaflow_onboarded') === 'true') {
      localStorage.setItem('slang_onboarded', 'true');
      return true;
    }
    return false;
  });

  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [activeTab, setActiveTab] = useState<TabMode>('quick');
  const [phonemeViewMode, setPhonemeViewMode] = useState<PhonemeViewMode>('list');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('slang_theme') === 'dark';
  });
  
  const [currentPrompt, setCurrentPrompt] = useState("Welcome! Loading your lesson...");
  const [promptContext, setPromptContext] = useState("");
  const [isLessonLoading, setIsLessonLoading] = useState(false);

  const [targetPhoneme, setTargetPhoneme] = useState<string | null>(null);
  
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [streak, setStreak] = useState(1);

  // Review Mode State
  const [reviewSession, setReviewSession] = useState<SessionRecord | null>(null);

  // Lazy Initialize Profile from Storage to ensure preferences are pre-filled immediately
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('slang_profile');
    const old = localStorage.getItem('linguaflow_profile');
    
    if (saved) return JSON.parse(saved);
    if (old) {
      const parsed = JSON.parse(old);
      localStorage.setItem('slang_profile', old);
      return parsed;
    }

    return {
      level: 'intermediate',
      native_language: 'Spanish',
      target_language: 'English',
      accent_reduction_goal: 'General American',
      motivation: 'travel',
      daily_goal_minutes: 10
    };
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Persist Profile Changes Automatically
  useEffect(() => {
    localStorage.setItem('slang_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Persist Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('slang_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('slang_theme', 'light');
    }
  }, [isDarkMode]);

  // Load History (Async)
  useEffect(() => {
    const loadHistory = async () => {
       const records = await getHistory();
       setHistory(records);
    };
    loadHistory();

    const savedStreak = localStorage.getItem('user_streak');
    if(savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  // Effect to fetch daily lesson once onboarded
  useEffect(() => {
    if (hasOnboarded && activeTab === 'quick' && !targetPhoneme) {
      fetchDailyLesson();
    }
  }, [hasOnboarded, activeTab, targetPhoneme]);

  const fetchDailyLesson = async () => {
    if (isLessonLoading) return;
    setIsLessonLoading(true);
    try {
      const plan = await generateLessonPlan(userProfile);
      setCurrentPrompt(plan.prompt);
      setPromptContext(plan.context);
    } catch (e) {
      console.error(e);
      setCurrentPrompt("Tell me about your day so far.");
    } finally {
      setIsLessonLoading(false);
    }
  };

  const handleOnboardingComplete = (profileData: Partial<UserProfile>) => {
    const newProfile = { ...userProfile, ...profileData };
    setUserProfile(newProfile);
    setHasOnboarded(true);
    localStorage.setItem('slang_onboarded', 'true');
    // profile saved via useEffect
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setAppState(AppState.RECORDING);
    } catch (err) {
      setError("Could not access microphone. Please allow permissions.");
      console.error(err);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
      setAudioBlob(blob);
      mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
      await processRecording(blob);
    };
  };

  const processRecording = async (blob: Blob) => {
    setAppState(AppState.ANALYZING);
    try {
      const base64Audio = await blobToBase64(blob);
      const result = await analyzeAudio(base64Audio, userProfile, currentPrompt, targetPhoneme);
      setAnalysis(result);
      
      // Async Save
      await saveSession(result, blob, targetPhoneme);
      const updatedHistory = await getHistory();
      setHistory(updatedHistory);
      
      setStreak(s => s + 1);
      localStorage.setItem('user_streak', (streak + 1).toString());

      setAppState(AppState.RESULTS);
    } catch (err) {
      setError("Analysis failed. Please check your API key and try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleRetry = () => {
    setAppState(AppState.IDLE);
    setAnalysis(null);
    setAudioBlob(null);
  };

  const resetToSelection = () => {
    setAppState(AppState.IDLE);
    setAnalysis(null);
    setAudioBlob(null);
    setTargetPhoneme(null);
    fetchDailyLesson(); 
  };

  const refreshPrompt = () => {
    fetchDailyLesson();
  };

  const handlePhonemeSelect = (phoneme: string, prompt: string) => {
    setTargetPhoneme(phoneme);
    setCurrentPrompt(prompt);
    setPromptContext(`Drill: /${phoneme}/`);
  };

  // Review Mode Handlers
  const handleReviewSession = (session: SessionRecord) => {
     setReviewSession(session);
  };

  const handleCloseReview = () => {
     setReviewSession(null);
  };

  const handleDeleteSession = async (id: string) => {
      await deleteSession(id);
      const updated = await getHistory();
      setHistory(updated);
  };

  if (!hasOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 cursor-pointer" onClick={() => { setActiveTab('quick'); setReviewSession(null); }}>
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">Slang</span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
             
             {/* Streak Counter */}
             <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full border border-orange-100 dark:border-orange-900/50" title="Daily Streak">
                <Flame className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{streak}</span>
             </div>

             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Native Language Selector */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-colors">
               <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Native:</span>
               <select 
                 value={userProfile.native_language}
                 onChange={(e) => setUserProfile({...userProfile, native_language: e.target.value})}
                 className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer border-none p-0 focus:ring-0 max-w-[100px]"
               >
                 {NATIVE_LANGUAGES.map(lang => (
                   <option key={lang} value={lang} className="dark:bg-slate-800">{lang}</option>
                 ))}
               </select>
            </div>

             {/* Target Language Selector */}
             <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-colors">
               <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Target:</span>
               <select 
                 value={userProfile.target_language}
                 onChange={(e) => setUserProfile({...userProfile, target_language: e.target.value})}
                 className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer border-none p-0 focus:ring-0 max-w-[100px]"
               >
                 {TARGET_LANGUAGES.map(lang => (
                   <option key={lang} value={lang} className="dark:bg-slate-800">{lang}</option>
                 ))}
               </select>
            </div>

            {/* Accent Selector (Only if English) */}
            {userProfile.target_language === 'English' && (
                <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-colors">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Accent:</span>
                  <select 
                    value={userProfile.accent_reduction_goal}
                    onChange={(e) => setUserProfile({...userProfile, accent_reduction_goal: e.target.value})}
                    className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer border-none p-0 focus:ring-0 max-w-[140px]"
                  >
                    {TARGET_ACCENTS.map(accent => (
                      <option key={accent} value={accent} className="dark:bg-slate-800">{accent}</option>
                    ))}
                  </select>
                </div>
            )}

          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-center justify-center animate-in fade-in">
            {error}
          </div>
        )}

        {/* Review Mode Override */}
        {reviewSession ? (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-4">
                <div className="w-full max-w-4xl mb-6 flex justify-between items-center">
                  <button 
                    onClick={handleCloseReview}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 transition-all shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Progress
                  </button>
                  <div className="text-sm text-slate-500">
                      Reviewing Session from {new Date(reviewSession.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <ResultsView 
                  analysis={reviewSession.full_analysis} 
                  audioBlob={reviewSession.audioBlob || null} 
                  onRetry={handleCloseReview} 
                  isDarkMode={isDarkMode}
                />
            </div>
        ) : (
        
        /* Normal App Flow */
        <>
        {(appState === AppState.IDLE || appState === AppState.RECORDING) && (
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {appState === AppState.IDLE && !targetPhoneme && (
              <div className="mb-12 p-1 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl inline-flex gap-1 shadow-inner">
                <button
                  onClick={() => setActiveTab('quick')}
                  className={`px-6 md:px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === 'quick' 
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md scale-[1.02]' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Daily Lesson
                </button>
                <button
                  onClick={() => setActiveTab('phoneme')}
                  className={`px-6 md:px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === 'phoneme' 
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md scale-[1.02]' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Sound Drill
                </button>
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`px-6 md:px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    activeTab === 'progress' 
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md scale-[1.02]' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Progress
                </button>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="w-full animate-in fade-in">
                <div className="flex items-baseline justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                   <div className="text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Your Progress</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" /> 
                      Goal: {userProfile.daily_goal_minutes}m/day • {userProfile.motivation}
                    </p>
                   </div>
                   <div className="text-right hidden sm:block">
                      <p className="text-sm text-slate-400">Current Level</p>
                      <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 capitalize">{userProfile.level}</p>
                   </div>
                </div>
                <ProgressView 
                    history={history} 
                    isDarkMode={isDarkMode} 
                    onReviewSession={handleReviewSession}
                    onDeleteSession={handleDeleteSession}
                />
              </div>
            )}

            {activeTab !== 'progress' && (
              <>
                <div className="mb-10 space-y-3 w-full">
                  {targetPhoneme && (
                    <button 
                      onClick={resetToSelection}
                      className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-700"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Sounds
                    </button>
                  )}
                  
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                    {targetPhoneme ? (
                        <span className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                            Mastering the <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50">/{targetPhoneme}/</span> Sound
                        </span>
                    ) : (activeTab === 'quick' ? 'Your Daily Practice' : 'Precision Training')}
                  </h1>
                  
                  {!targetPhoneme && activeTab === 'phoneme' && (
                     <div className="flex flex-col items-center gap-6">
                       <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                         Explore the International Phonetic Alphabet (IPA) chart or select a common sound card below.
                       </p>
                       
                       {/* View Toggle for Phonemes */}
                       <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                          <button 
                             onClick={() => setPhonemeViewMode('list')}
                             className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${phonemeViewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500'}`}
                          >
                             <LayoutGrid className="w-4 h-4" /> Cards
                          </button>
                          <button 
                             onClick={() => setPhonemeViewMode('chart')}
                             className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${phonemeViewMode === 'chart' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500'}`}
                          >
                             <Map className="w-4 h-4" /> IPA Chart
                          </button>
                       </div>
                     </div>
                  )}
                </div>

                {!targetPhoneme && activeTab === 'phoneme' && (
                   <div className="w-full">
                      {phonemeViewMode === 'list' ? (
                        <PhonemeSelector 
                          onSelect={handlePhonemeSelect} 
                          onViewChart={() => setPhonemeViewMode('chart')}
                          phonemes={[]} 
                        />
                      ) : (
                        <IPAChart onSelect={handlePhonemeSelect} />
                      )}
                   </div>
                )}

                {(activeTab === 'quick' || targetPhoneme) && (
                  <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="bg-white dark:bg-slate-800/50 p-8 md:p-12 rounded-3xl shadow-xl shadow-indigo-900/5 dark:shadow-none border border-slate-100 dark:border-slate-700 mb-10 relative group transition-all hover:border-indigo-200 dark:hover:border-indigo-800/50">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">
                         {activeTab === 'quick' ? (promptContext || "Today's Challenge") : "Target Drill"}
                      </div>
                      
                      {isLessonLoading ? (
                         <div className="flex flex-col items-center justify-center h-32 space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <p className="text-sm text-slate-400">Generating your personalized lesson...</p>
                         </div>
                      ) : (
                         <p className="text-2xl md:text-4xl font-serif text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line text-center">
                           {currentPrompt}
                         </p>
                      )}

                      {!targetPhoneme && !isLessonLoading && (
                        <button 
                          onClick={refreshPrompt}
                          className="absolute top-1/2 -right-12 -translate-y-1/2 p-3 text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden md:block"
                          title="Get New Lesson"
                        >
                          <RefreshCcw className="w-8 h-8" />
                        </button>
                      )}
                    </div>

                    <div className="w-full mb-8 px-4">
                       <Waveform isRecording={appState === AppState.RECORDING} isDarkMode={isDarkMode} />
                    </div>

                    <div className="flex gap-6 justify-center items-center">
                      {appState === AppState.IDLE ? (
                        <button 
                          onClick={startRecording}
                          className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 text-white shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none"
                        >
                          <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:scale-110 transition-transform"></div>
                          <Mic className="w-10 h-10" />
                        </button>
                      ) : (
                        <button 
                          onClick={stopRecording}
                          className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none"
                        >
                           <div className="w-8 h-8 bg-white rounded-sm shadow-sm" />
                           <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20"></div>
                        </button>
                      )}
                    </div>
                    <p className="mt-6 text-sm font-medium text-slate-400 animate-pulse">
                        {appState === AppState.RECORDING ? "Listening..." : "Tap microphone to start"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
              <Loader2 className="w-20 h-20 text-indigo-600 dark:text-indigo-400 animate-spin relative z-10" />
            </div>
            <h2 className="mt-8 text-3xl font-bold text-slate-800 dark:text-slate-100">Analyzing Nuances</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Checking {targetPhoneme ? `articulation of /${targetPhoneme}/` : "fluency and prosody"}...
            </p>
          </div>
        )}

        {appState === AppState.RESULTS && analysis && (
          <div className="flex flex-col items-center">
            {targetPhoneme && (
              <div className="w-full max-w-4xl mb-6 flex justify-start">
                <button 
                  onClick={resetToSelection}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Choose Another Sound
                </button>
              </div>
            )}
            <ResultsView 
              analysis={analysis} 
              audioBlob={audioBlob} 
              onRetry={handleRetry} 
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {appState === AppState.ERROR && (
           <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold">!</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Analysis Failed</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">{error || "Something went wrong."}</p>
              <button onClick={handleRetry} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Try Again</button>
           </div>
        )}
        </>
        )}

      </main>
    </div>
  );
}
