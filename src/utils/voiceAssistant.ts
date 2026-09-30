import { SupportedLanguage } from '../types';

export interface VoiceAssistantResponse {
  spokenText: string;
  action?: 'open_sos' | 'show_shelter' | 'show_safe_route' | 'show_status';
  urgency: 'high' | 'medium' | 'normal';
}

/**
 * Converts text into spoken voice using the browser's built-in Web Speech API.
 * 
 * Works 100% offline without external network calls or cloud AI latency.
 * Supports English (en-US), Tamil (ta-IN), and Hindi (hi-IN).
 */
export function synthesizeSpeech(text: string, lang: SupportedLanguage): Promise<void> {
  return new Promise((resolve) => {
    // Check if the browser supports SpeechSynthesis
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    if (!text || !text.trim()) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Cancel any prior speech
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'ta') {
        utterance.lang = 'ta-IN';
      } else if (lang === 'hi') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.rate = 1.05; // Slightly faster for crisp emergency instructions
      utterance.pitch = 1.0;

      let hasResolved = false;
      const done = () => {
        if (!hasResolved) {
          hasResolved = true;
          resolve();
        }
      };

      utterance.onend = done;
      utterance.onerror = done;

      // Safety timeout: Ensure promise resolves even if speech engine stalls
      setTimeout(done, 12000);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      resolve();
    }
  });
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Web Audio API Sound Generator for Ringtone and Emergency Siren
let activeAudioCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let sirenInterval: any = null;
let ringtoneInterval: any = null;

function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!activeAudioCtx || activeAudioCtx.state === 'closed') {
      activeAudioCtx = new AudioContextClass();
    }
    if (activeAudioCtx.state === 'suspended') {
      activeAudioCtx.resume();
    }
    return activeAudioCtx;
  } catch (e) {
    return null;
  }
}

export function stopAudioEffects(): void {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (ringtoneInterval) {
    clearInterval(ringtoneInterval);
    ringtoneInterval = null;
  }
  activeOscillators.forEach(osc => {
    try {
      osc.stop();
      osc.disconnect();
    } catch (e) {}
  });
  activeOscillators = [];
}

/**
 * Plays a realistic dual-tone civil defense emergency warning siren (warble tone)
 */
export function playEmergencySiren(durationSeconds: number = 5): void {
  stopAudioEffects();
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';

  // Civil defense warble between 600Hz and 960Hz
  let high = true;
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  activeOscillators.push(osc);

  sirenInterval = setInterval(() => {
    if (!ctx || ctx.state === 'closed') return;
    const now = ctx.currentTime;
    const targetFreq = high ? 960 : 600;
    osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.4);
    high = !high;
  }, 450);

  setTimeout(() => {
    stopAudioEffects();
  }, durationSeconds * 1000);
}

/**
 * Plays realistic telephone incoming ring tone (440Hz + 480Hz dual tone cadence)
 */
export function playPhoneRingtone(): void {
  stopAudioEffects();
  const ctx = getAudioContext();
  if (!ctx) return;

  const playRingBurst = () => {
    if (!ctx || ctx.state === 'closed') return;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.frequency.setValueAtTime(440, ctx.currentTime);
    osc2.frequency.setValueAtTime(480, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();

    setTimeout(() => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
            osc1.disconnect();
            osc2.disconnect();
          } catch (e) {}
        }, 120);
      } catch (e) {}
    }, 1800);
  };

  playRingBurst();
  ringtoneInterval = setInterval(playRingBurst, 3500);
}

/**
 * Pre-configured AI Automated Emergency Voice Scripts for both Pre-Disaster and Active Disaster phases
 */
export interface EmergencyVoiceScript {
  header: string;
  body: string;
  spokenAudioText: string;
  ivrKeypadGuide: string;
}

export function getAutoVoiceCallScript(
  phase: 'before' | 'during' | 'after', 
  lang: SupportedLanguage, 
  zoneName: string = 'Delta Enclave / Zone A'
): EmergencyVoiceScript {
  if (phase === 'before') {
    // PRE-DISASTER / EARLY WARNING SCRIPTS
    if (lang === 'ta') {
      return {
        header: 'முன்னெச்சரிக்கை தானியங்கி குரல் அழைப்பு (PRE-DISASTER EARLY WARNING)',
        body: `கவனத்திற்கு: பேரிடர் கட்டுப்பாட்டு மையத்திலிருந்து அவசர எச்சரிக்கை! ${zoneName} பகுதியில் அடுத்த 90 நிமிடங்களில் கடுமையான வெள்ளப்பெருக்கு ஏற்படும் என கணிக்கப்பட்டுள்ளது. நீர்மட்டம் 2.5 மீட்டருக்கு மேல் உயரக்கூடும். உடனடியாக முகாமிற்கு வெளியேறவும்.`,
        spokenAudioText: `அவசர முன்னெச்சரிக்கை அறிவிப்பு! பேரிடர் மேலாண்மை மையம் சார்பாக பேசுகிறோம். அடுத்த தொண்ணூறு நிமிடங்களில் உங்கள் பகுதியில் கடுமையான வெள்ள அபாயம் உள்ளது. உடனடியாக பாதுகாப்பான வடக்கு மேல்நிலைப்பள்ளி முகாமிற்கு செல்லுங்கள். நீங்கள் பாதுகாப்பாக இருந்தால் எண் ஒன்றை அழுத்தவும். அவசர உதவி தேவைப்பட்டால் எண் இரண்டை அழுத்தவும்.`,
        ivrKeypadGuide: 'விசை 1: பாதுகாப்பாக உள்ளேன் (🛡️ SAFE) | விசை 2: அவசர மீட்புப்படை தேவை (SOS) | விசை 3: அருகிலுள்ள முகாம்'
      };
    }
    if (lang === 'hi') {
      return {
        header: 'पूर्व-आपदा स्वचालित आपातकालीन वॉइस कॉल (PRE-DISASTER EARLY WARNING)',
        body: `सावधान: आपदा नियंत्रण कमान केंद्र की पूर्व-चेतावनी! ${zoneName} क्षेत्र में अगले 90 मिनटों में भारी बाढ़ का गंभीर खतरा है। जलस्तर 2.5 मीटर पार करने का अनुमान है। तुरंत सुरक्षित आश्रयों में चले जाएं।`,
        spokenAudioText: `यह आपदा नियंत्रण कक्ष से महत्वपूर्ण पूर्व-चेतावनी संदेश है। अगले नब्बे मिनटों में आपके क्षेत्र में भयंकर बाढ़ आने का अनुमान है। कृपया तुरंत ऊंचे स्थानों या उत्तरी राहत शिविर में चले जाएं। यदि आप सुरक्षित हैं, तो 1 दबाएं। आपातकालीन बचाव दल के लिए 2 दबाएं।`,
        ivrKeypadGuide: 'कुंजी 1: मैं सुरक्षित हूँ (🛡️ SAFE) | कुंजी 2: तत्काल बचाव दल चाहिए (SOS) | कुंजी 3: निकटतम राहत शिविर'
      };
    }
    return {
      header: 'AI EARLY WARNING AUTOMATED EMERGENCY CALL (PRE-DISASTER PHASE)',
      body: `URGENT EARLY WARNING from ResQ-AI Disaster Command. Severe flood surge predicted to inundate ${zoneName} within 90 minutes. Forecasted water height exceeds 2.5 meters. Evacuate low-lying areas now to North High School Complex. Secure vital documents and medications.`,
      spokenAudioText: `Attention residents! This is an urgent automated early warning from ResQ-AI Emergency Disaster Command. A major flood surge is forecasted to impact your area within ninety minutes. Water levels will exceed two point five meters. Please evacuate immediately to the nearest safe shelter at North High Complex via elevated routes. Press 1 to confirm you are safe and secure. Press 2 if you require emergency evacuation assistance.`,
      ivrKeypadGuide: 'Key 1: I Am Safe & Secure (🛡️ SAFE) | Key 2: Request Emergency Evacuation (SOS) | Key 3: Safe Route Directions'
    };
  } else if (phase === 'during') {
    // ACTIVE DISASTER / CRITICAL EVACUATION CALLS
    if (lang === 'ta') {
      return {
        header: 'அதிதீவிர பேரிடர் அவசர குரல் அழைப்பு (CRITICAL LIFE-SAFETY ALERT)',
        body: `அவசர எச்சரிக்கை! ${zoneName} பகுதியில் அணை/ஆற்று நீர்மட்டம் அபாய அளவைத் தாண்டியது. தரைத்தள வீடுகள் மற்றும் சாலைகள் மூழ்கியுள்ளன. வீட்டின் மேல்மாடிக்கு செல்லவும். படகு மீட்புக்குழுக்கள் விரைகின்றன.`,
        spokenAudioText: `அதிதீவிர அவசர எச்சரிக்கை! உங்கள் பகுதியில் உடனடி வெள்ளப்பெருக்கு ஏற்பட்டுள்ளது. தரைத்தள சாலைகளை எக்காரணம் கொண்டும் பயன்படுத்த வேண்டாம். உடனடியாக மாடி அல்லது மொட்டை மாடிக்கு செல்லுங்கள். தேசிய பேரிடர் மீட்புப் படகுகள் வந்து கொண்டிருக்கின்றன. நீங்கள் பாதுகாப்பாக இருந்தால் எண் ஒன்றை அழுத்தவும். உடனடி படகு மீட்பு தேவைப்பட்டால் எண் இரண்டை அழுத்தவும்.`,
        ivrKeypadGuide: 'விசை 1: பாதுகாப்பாக உள்ளேன் (🛡️ SAFE) | விசை 2: உடனடி படகு மீட்பு தேவை (SOS) | விசை 3: அவசர வழி'
      };
    }
    if (lang === 'hi') {
      return {
        header: 'सक्रिय आपदा जीवन रक्षा आपातकालीन कॉल (CRITICAL LIFE-SAFETY ALERT)',
        body: `अति-गंभीर चेतावनी: ${zoneName} में बाढ़ का जलस्तर खतरे के निशान को पार कर गया है। निचले रास्ते जलमग्न हैं। तुरंत छतों या ऊपरी मंजिलों पर जाएं। बचाव नौकाएं आपके क्षेत्र में तैनात हैं।`,
        spokenAudioText: `यह एक अति-गंभीर जीवन रक्षा आपातकालीन चेतावनी है। आपके क्षेत्र में नदी का पानी तेजी से बढ़ रहा है। जलमग्न सड़कों पर बिल्कुल न जाएं। तुरंत मकान की ऊपरी मंजिल या छत पर चले जाएं। एनडीआरएफ की नावें आपके इलाके में तैनात हैं। यदि आप सुरक्षित हैं तो 1 दबाएं। तत्काल बचाव के लिए 2 दबाएं।`,
        ivrKeypadGuide: 'कुंजी 1: मैं सुरक्षित हूँ (🛡️ SAFE) | कुंजी 2: तत्काल नाव बचाव चाहिए (SOS) | कुंजी 3: सुरक्षित मार्ग'
      };
    }
    return {
      header: 'CRITICAL LIFE-SAFETY AUTOMATED VOICE EVACUATION CALL (ACTIVE DISASTER)',
      body: `CRITICAL EMERGENCY ALERT from Disaster Command. Active flood breach confirmed in ${zoneName}. Rapidly rising floodwaters overtopping roads. Ascend to upper floors or rooftops immediately. Do not attempt to wade through floodwaters. Rescue boats are actively operating in your grid.`,
      spokenAudioText: `Critical emergency alert from Disaster Command! An active flood breach has occurred in your zone. Water levels are rising rapidly. Do not attempt to cross flooded roads. Ascend to upper floors or rooftops immediately. Emergency rescue boats are dispatched to your sector. Press 1 if you are safe and secure. Press 2 for immediate emergency rescue extraction.`,
      ivrKeypadGuide: 'Key 1: Confirm Safe & Secure (🛡️ SAFE) | Key 2: Immediate Boat Rescue SOS | Key 3: Safe Shelter Location'
    };
  } else {
    // POST-DISASTER RECOVERY SCRIPT
    return {
      header: 'POST-DISASTER RELIEF & ROLL-CALL RECONCILIATION',
      body: `Notice from Relief Command: Floodwaters receding in ${zoneName}. Drinking water distribution and medical screening available at St. Mary's Shelter and North High. Report any missing persons or structural hazards.`,
      spokenAudioText: `This is ResQ-AI Relief Command with a post-disaster recovery update. Clean drinking water distribution and medical screening are active at designated shelters. Please press 1 to confirm your safe and secure status.`,
      ivrKeypadGuide: 'Key 1: Confirm Safe & Secure (🛡️ SAFE) | Key 2: Request Relief Supplies'
    };
  }
}

export function analyzeVoiceQuery(query: string, lang: SupportedLanguage): VoiceAssistantResponse {
  const q = query.toLowerCase().trim();

  // English Intents
  if (lang === 'en') {
    if (q.includes('danger') || q.includes('safe') || q.includes('risk') || q.includes('status')) {
      return {
        spokenText: 'Warning in your sector. Zone A water levels are rising. You are 2.4 kilometers from the flood boundary. Evacuation is recommended towards North High School.',
        action: 'show_status',
        urgency: 'high'
      };
    }
    if (q.includes('shelter') || q.includes('go') || q.includes('where') || q.includes('evacuate')) {
      return {
        spokenText: 'The nearest verified safe shelter is North High School Complex, located 1.2 kilometers north via the Elevated Expressway. 500 beds remain available.',
        action: 'show_shelter',
        urgency: 'medium'
      };
    }
    if (q.includes('road') || q.includes('route') || q.includes('drive') || q.includes('path')) {
      return {
        spokenText: 'Do not use Riverbank Boulevard or Apex Bridge. They are submerged. Take North Elevated Expressway which is dry and secured by traffic police.',
        action: 'show_safe_route',
        urgency: 'medium'
      };
    }
    if (q.includes('ambulance') || q.includes('doctor') || q.includes('medical') || q.includes('hospital')) {
      return {
        spokenText: 'Opening emergency SOS for medical priority. District Command will stage an Advanced Life Support ambulance.',
        action: 'open_sos',
        urgency: 'high'
      };
    }
    if (q.includes('sos') || q.includes('help') || q.includes('trapped') || q.includes('rescue')) {
      return {
        spokenText: 'Activating Emergency SOS. Please confirm your exact location and situation for response team dispatch.',
        action: 'open_sos',
        urgency: 'high'
      };
    }
    if (q.includes('flood') || q.includes('water')) {
      return {
        spokenText: 'Flood waters in Zone A have reached 2.1 meters and are spreading toward Zone B within the next hour. Move to elevated ground immediately.',
        action: 'show_safe_route',
        urgency: 'high'
      };
    }

    return {
      spokenText: 'ResQAI Emergency Intelligence active. A flood warning is in effect. Avoid low-lying river areas and proceed to North High shelter via elevated corridor.',
      action: 'show_status',
      urgency: 'medium'
    };
  }

  // Tamil Intents
  if (lang === 'ta') {
    if (q.includes('ஆபத்து') || q.includes('பாதுகாப்பு') || q.includes('நிலைமை') || q.includes('danger')) {
      return {
        spokenText: 'உங்கள் பகுதியில் வெள்ள அபாயம் உள்ளது. நதிக்கரை பகுதியிலிருந்து உடனடியாக வெளியேறி வடக்கு பள்ளி முகாமுக்கு செல்லவும்.',
        action: 'show_status',
        urgency: 'high'
      };
    }
    if (q.includes('முகாம்') || q.includes('எங்கே') || q.includes('shelter')) {
      return {
        spokenText: 'அருகிலுள்ள பாதுகாப்பான முகாம் வடக்கு மேல்நிலைப்பள்ளி வளாகம். அங்கு 500 படுக்கைகள் காலியாக உள்ளன.',
        action: 'show_shelter',
        urgency: 'medium'
      };
    }
    if (q.includes('சாலை') || q.includes('பாதை') || q.includes('route')) {
      return {
        spokenText: 'ஆற்றோர சாலையை தவிர்க்கவும். வடக்கு மேம்பாலம் வழியாக மட்டுமே செல்லவும். அந்த சாலை பாதுகாப்பானது.',
        action: 'show_safe_route',
        urgency: 'medium'
      };
    }
    if (q.includes('ஆம்புலன்ஸ்') || q.includes('மருத்துவம்') || q.includes('ambulance')) {
      return {
        spokenText: 'மருத்துவ அவசர உதவி தொடங்கப்படுகிறது. உங்கள் இருப்பிடத்தை உறுதிசெய்யவும்.',
        action: 'open_sos',
        urgency: 'high'
      };
    }
    if (q.includes('உதவி') || q.includes('சிக்கி') || q.includes('sos')) {
      return {
        spokenText: 'அவசர SOS உதவி தொடங்கப்படுகிறது. மீட்புப்படையை அழைக்க தயவுசெய்து உறுதிப்படுத்தவும்.',
        action: 'open_sos',
        urgency: 'high'
      };
    }

    return {
      spokenText: 'உங்கள் பகுதியில் வெள்ள எச்சரிக்கை விடுக்கப்பட்டுள்ளது. மேடான பகுதிக்கு உடனடியாக செல்லவும்.',
      action: 'show_status',
      urgency: 'medium'
    };
  }

  // Hindi Intents
  if (lang === 'hi') {
    if (q.includes('खतरा') || q.includes('सुरक्षित') || q.includes('स्थिति') || q.includes('danger')) {
      return {
        spokenText: 'आपके क्षेत्र में बाढ़ का खतरा है। नदी किनारे से दूर रहें और तुरंत उत्तरी राहत केंद्र की ओर बढ़ें।',
        action: 'show_status',
        urgency: 'high'
      };
    }
    if (q.includes('आश्रय') || q.includes('कहाँ') || q.includes('shelter')) {
      return {
        spokenText: 'निकटतम सुरक्षित आश्रय नॉर्थ हाई स्कूल राहत केंद्र है, जो 1.2 किलोमीटर दूर है और 500 बिस्तर उपलब्ध हैं।',
        action: 'show_shelter',
        urgency: 'medium'
      };
    }
    if (q.includes('रास्ता') || q.includes('सड़क') || q.includes('route')) {
      return {
        spokenText: 'रिवरबैंक मार्ग और मुख्य पुल जलमग्न हैं। केवल उत्तरी एलिवेटेड एक्सप्रेसवे का प्रयोग करें।',
        action: 'show_safe_route',
        urgency: 'medium'
      };
    }
    if (q.includes('एम्बुलेंस') || q.includes('डॉक्टर') || q.includes('ambulance')) {
      return {
        spokenText: 'चिकित्सा आपातकाल के लिए एसओएस खोला जा रहा है। कमान केंद्र एम्बुलेंस उपलब्ध कराएगा।',
        action: 'open_sos',
        urgency: 'high'
      };
    }
    if (q.includes('मदद') || q.includes('फंसे') || q.includes('sos')) {
      return {
        spokenText: 'आपातकालीन एसओएस सक्रिय किया जा रहा है। कृपया अपनी स्थिति और स्थान की पुष्टि करें।',
        action: 'open_sos',
        urgency: 'high'
      };
    }

    return {
      spokenText: 'क्षेत्र में बाढ़ की चेतावनी जारी है। निचले इलाकों से तुरंत सुरक्षित ऊंचाई वाले आश्रय में जाएं।',
      action: 'show_status',
      urgency: 'medium'
    };
  }

  return {
    spokenText: 'Emergency instructions: Follow safe routes to the nearest designated shelter.',
    action: 'show_status',
    urgency: 'normal'
  };
}
