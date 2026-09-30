import React, { useState, useEffect } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, Send, AlertTriangle } from 'lucide-react';
import { analyzeVoiceQuery, synthesizeSpeech, stopSpeech } from '../../utils/voiceAssistant';
import { getAIVoiceAssistance } from '../../services/geminiService';
import { SupportedLanguage } from '../../types';

export const VoiceAssistantModal: React.FC = () => {
  const { language, setLanguage, t, setActiveModal } = useDisaster();

  const [isListening, setIsListening] = useState(false);
  const [spokenInput, setSpokenInput] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Suggested Prompts based on active language
  const suggestedQueries = language === 'ta' ? [
    'நான் ஆபத்தில் உள்ளேனா?',
    'அருகிலுள்ள முகாம் எங்கே?',
    'இந்த சாலை பாதுகாப்பானதா?',
    'ஆம்புலன்ஸ் உதவி தேவை',
    'வெள்ள நிலைமை என்ன?'
  ] : language === 'hi' ? [
    'क्या मैं खतरे में हूँ?',
    'निकटतम आश्रय कहाँ है?',
    'क्या यह सड़क सुरक्षित है?',
    'मुझे एम्बुलेंस चाहिए',
    'बाढ़ की स्थिति क्या है?'
  ] : [
    'Am I in danger?',
    'Where is the nearest shelter?',
    'Is this road safe?',
    'I need an ambulance',
    'What should I do?'
  ];

  const handleProcessQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setSpokenInput(queryText);
    setAssistantReply('Processing emergency assessment...');
    const res = await getAIVoiceAssistance(queryText, language);
    setAssistantReply(res.spokenText);

    // Speak response
    setIsPlayingAudio(true);
    await synthesizeSpeech(res.spokenText, language);
    setIsPlayingAudio(false);

    // Contextual action if requested
    if (res.action === 'open_sos') {
      setTimeout(() => {
        setActiveModal('sos');
      }, 2500);
    } else if (res.action === 'show_shelter') {
      setTimeout(() => {
        setActiveModal('shelters');
      }, 2500);
    } else if (res.action === 'show_safe_route') {
      setTimeout(() => {
        setActiveModal('safeRoute');
      }, 2500);
    }
  };

  const startVoiceRecognition = () => {
    // Check SpeechRecognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: cycle through first query
      handleProcessQuery(suggestedQueries[0]);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleProcessQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      handleProcessQuery(suggestedQueries[0]);
    }
  };

  const handleStopAudio = () => {
    stopSpeech();
    setIsPlayingAudio(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                ResQAI Multilingual Voice Assistant
              </h3>
              <p className="text-[11px] text-slate-400">
                Natural speech emergency guidance in English, தமிழ், and हिन्दी
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              setActiveModal(null);
            }}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Language Switcher inside Voice Modal */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-medium">{t.selectLanguage}:</span>
            <div className="flex items-center gap-1">
              {(['en', 'ta', 'hi'] as SupportedLanguage[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    language === lang 
                      ? 'bg-rose-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ்' : 'हिन्दी'}
                </button>
              ))}
            </div>
          </div>

          {/* Big Tactile Microphone Button with Sound Wave */}
          <div className="py-6 flex flex-col items-center justify-center space-y-3">
            <div className="relative">
              {isListening && (
                <span className="absolute -inset-3 rounded-full bg-rose-500/30 animate-ping"></span>
              )}
              {isPlayingAudio && (
                <span className="absolute -inset-3 rounded-full bg-cyan-500/30 animate-pulse"></span>
              )}

              <button
                onClick={startVoiceRecognition}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 ${
                  isListening 
                    ? 'bg-rose-600 ring-4 ring-rose-950 animate-pulse' 
                    : isPlayingAudio 
                      ? 'bg-cyan-600 ring-4 ring-cyan-950' 
                      : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : isPlayingAudio ? (
                  <Volume2 className="w-8 h-8 animate-bounce" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>

            <div className="text-center space-y-1">
              <div className="font-semibold text-white text-sm">
                {isListening ? t.listening : isPlayingAudio ? 'Speaking Response...' : t.voiceMicStart}
              </div>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                {t.voiceHelpPrompt}
              </p>
            </div>
          </div>

          {/* Quick Voice Chips */}
          <div>
            <div className="text-slate-400 font-semibold mb-2">
              Common Emergency Questions (Tap to Ask):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleProcessQuery(q)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors text-left"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* Live Transcript and Assistant Output Card */}
          {(spokenInput || assistantReply) && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              {spokenInput && (
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">You Asked:</span>
                  <p className="text-white font-medium text-xs">"{spokenInput}"</p>
                </div>
              )}

              {assistantReply && (
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-rose-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>ResQAI Response:</span>
                    </span>

                    {isPlayingAudio ? (
                      <button 
                        onClick={handleStopAudio} 
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <VolumeX className="w-3 h-3" /> Stop Speech
                      </button>
                    ) : (
                      <button 
                        onClick={() => synthesizeSpeech(assistantReply, language)} 
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                      >
                        <Volume2 className="w-3 h-3" /> Replay Voice
                      </button>
                    )}
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    {assistantReply}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
