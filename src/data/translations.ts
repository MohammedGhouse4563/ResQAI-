import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  appTitle: string;
  tagline: string;
  currentStatus: string;
  statusSafe: string;
  statusWatch: string;
  statusWarning: string;
  statusCritical: string;
  nearbyRisk: string;
  predictedImpact: string;
  recommendedAction: string;
  nearestShelter: string;
  safeRoute: string;
  sosButton: string;
  askAi: string;
  emergencyCall: string;
  reportHazard: string;
  iAmSafe: string;
  iAmSafeConfirmed: string;
  findShelter: string;
  findSafeRoute: string;
  criticalAlertHeader: string;
  evacuateInstruction: string;
  offlineBanner: string;
  offlineQueuedNotice: string;
  voiceHelpPrompt: string;
  listening: string;
  voiceMicStart: string;
  voiceMicStop: string;
  selectLanguage: string;
  emergencyType: string;
  medical: string;
  fire: string;
  flood: string;
  trapped: string;
  accident: string;
  missingPerson: string;
  rescueRequired: string;
  otherEmergency: string;
  confirmSos: string;
  sendingSos: string;
  sosSentSuccess: string;
  realCallDisclaimer: string;
  safeRoadStatus: string;
  distanceKm: string;
  capacityLeft: string;
  openDirections: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appTitle: 'ResQAI',
    tagline: 'Predict the Need. Position the Response.',
    currentStatus: 'Current Safety Status',
    statusSafe: 'SAFE',
    statusWatch: 'WATCH',
    statusWarning: 'WARNING',
    statusCritical: 'CRITICAL',
    nearbyRisk: 'Nearby Hazard: Flash Flood detected',
    predictedImpact: 'Expected impact window: Next 45 to 90 mins',
    recommendedAction: 'Move toward designated high-ground safe shelter. Avoid low-lying river bank roads.',
    nearestShelter: 'Nearest Safe Shelter',
    safeRoute: 'Recommended Safe Evacuation Route',
    sosButton: 'EMERGENCY SOS',
    askAi: 'Voice Assistant',
    emergencyCall: 'Direct 112 Call',
    reportHazard: 'Report Hazard',
    iAmSafe: 'I Am Safe (Check-in)',
    iAmSafeConfirmed: 'Safety status recorded & broadcast to family & relief registry.',
    findShelter: 'Find Safe Shelter',
    findSafeRoute: 'View Safe Route',
    criticalAlertHeader: 'CRITICAL DISASTER WARNING',
    evacuateInstruction: 'Immediate evacuation advised. Follow marked elevated corridor toward North Relief Center.',
    offlineBanner: 'Low Connectivity / Offline Mode Active. Safety cache loaded.',
    offlineQueuedNotice: 'SOS queued locally. Will transmit automatically when cell signal returns.',
    voiceHelpPrompt: 'Tap microphone and ask: "Am I in danger?", "Where is the nearest shelter?", or "I need an ambulance"',
    listening: 'Listening to your voice...',
    voiceMicStart: 'Speak Emergency Query',
    voiceMicStop: 'Processing Emergency Response',
    selectLanguage: 'Language',
    emergencyType: 'Select Emergency Category',
    medical: 'Medical Assistance',
    fire: 'Fire Hazard',
    flood: 'Water Inundation / Flood',
    trapped: 'Person Trapped / Stranded',
    accident: 'Traffic / Structural Accident',
    missingPerson: 'Missing Family Member',
    rescueRequired: 'Immediate Boat/Rescue Team',
    otherEmergency: 'Other Urgent Hazard',
    confirmSos: 'Send SOS to Command Center',
    sendingSos: 'Transmitting Emergency Beacon...',
    sosSentSuccess: 'Emergency request registered with District Authority Command.',
    realCallDisclaimer: 'Direct telephony link: Opens your phone dialer to 112 Emergency Services. ResQAI will never simulate a fake completed call.',
    safeRoadStatus: 'Elevated & Clear (Verified safe from inundation)',
    distanceKm: 'km away',
    capacityLeft: 'beds available',
    openDirections: 'Start Navigation',
  },
  ta: {
    appTitle: 'ResQAI (ரெஸ்க்யூ ஏஐ)',
    tagline: 'தேவையை கணிப்போம். விரைந்து மீட்போம்.',
    currentStatus: 'தற்போதைய பாதுகாப்பு நிலை',
    statusSafe: 'பாதுகாப்பானது',
    statusWatch: 'கண்காணிப்பு நிலை',
    statusWarning: 'எச்சரிக்கை நிலை',
    statusCritical: 'அதிதீவிர ஆபத்து',
    nearbyRisk: 'அருகிலுள்ள ஆபத்து: தீவிர வெள்ளப்பெருக்கு கண்டறியப்பட்டுள்ளது',
    predictedImpact: 'பாதிப்பு நேரம்: அடுத்த 45 - 90 நிமிடங்களில் அதிகரிக்கும்',
    recommendedAction: 'உடனடியாக மேடான பாதுகாப்பான முகாமுக்கு செல்லவும். ஆற்றோர தாழ்வான சாலைகளை தவிர்க்கவும்.',
    nearestShelter: 'அருகிலுள்ள பாதுகாப்பு முகாம்',
    safeRoute: 'பாதுகாப்பான வெளியேறும் பாதை',
    sosButton: 'அவசர உதவி SOS',
    askAi: 'குரல் உதவியாளர்',
    emergencyCall: '112 அவசர அழைப்பு',
    reportHazard: 'ஆபத்தை பதிவுசெய்',
    iAmSafe: 'நான் பாதுகாப்பாக உள்ளேன்',
    iAmSafeConfirmed: 'உங்கள் பாதுகாப்பு பதிவு செய்யப்பட்டது.',
    findShelter: 'முகாம் கண்டறி',
    findSafeRoute: 'பாதுகாப்பான பாதை',
    criticalAlertHeader: 'அதிதீவிர பேரிடர் எச்சரிக்கை',
    evacuateInstruction: 'உடனடியாக பாதுகாப்பான பகுதிக்கு செல்லவும். வடக்குப் பகுதி முகாமிற்கு மேடான பாதை வழியாக செல்லவும்.',
    offlineBanner: 'இணைய சேவை குறைவு / ஆஃப்லைன் முறை செயல்படுகிறது.',
    offlineQueuedNotice: 'SOS தகவல் பதிவுசெய்யப்பட்டது. சிக்னல் கிடைத்தவுடன் தானாகவே அனுப்பப்படும்.',
    voiceHelpPrompt: 'மைக் பட்டனை அழுத்தி கேட்கவும்: "நான் ஆபத்தில் உள்ளேனா?", "அருகிலுள்ள முகாம் எங்கே?", "ஆம்புலன்ஸ் தேவை"',
    listening: 'உங்கள் குரலைக் கேட்கிறது...',
    voiceMicStart: 'பேசவும்',
    voiceMicStop: 'பதில் பெறப்படுகிறது...',
    selectLanguage: 'மொழி',
    emergencyType: 'அவசர வகையை தேர்ந்தெடுக்கவும்',
    medical: 'மருத்துவ உதவி',
    fire: 'தீ விபத்து',
    flood: 'வெள்ளம் / நீர் சூழ்ந்துள்ளது',
    trapped: 'சிக்கிக்கொண்டோம் / மீட்கவும்',
    accident: 'விபத்து',
    missingPerson: 'காணாமல் போனவர்',
    rescueRequired: 'படகு மீட்புப்படை தேவை',
    otherEmergency: 'மற்ற அவசர நிலை',
    confirmSos: 'கட்டளை மையத்திற்கு SOS அனுப்பு',
    sendingSos: 'அவசர தகவல் அனுப்பப்படுகிறது...',
    sosSentSuccess: 'மாவட்ட பேரிடர் கட்டளை மையத்தில் பதிவு செய்யப்பட்டது.',
    realCallDisclaimer: 'இது நேரடியாக 112 டயலருக்கு கொண்டுசெல்லும். போலி அழைப்புகள் ஒருபோதும் செய்யப்படாது.',
    safeRoadStatus: 'பாதுகாப்பான மற்றும் நீர் வடியாத பாதை',
    distanceKm: 'கி.மீ தூரம்',
    capacityLeft: 'இடங்கள் உள்ளன',
    openDirections: 'வழிகாட்டுதலை தொடங்கு',
  },
  hi: {
    appTitle: 'ResQAI (रेस्क्यू एआई)',
    tagline: 'जरूरत का पूर्वानुमान। त्वरित राहत व बचाव।',
    currentStatus: 'वर्तमान सुरक्षा स्थिति',
    statusSafe: 'सुरक्षित',
    statusWatch: 'निगरानी स्तर',
    statusWarning: 'चेतावनी',
    statusCritical: 'गंभीर खतरा',
    nearbyRisk: 'निकटवर्ती आपदा: जलभराव व बाढ़ का बढ़ता जोखिम',
    predictedImpact: 'संभावित प्रभाव समय: अगले 45 से 90 मिनट में',
    recommendedAction: 'तत्काल ऊंचे स्थान वाले सुरक्षित आश्रय की ओर बढ़ें। निचले नदी तट मार्गों से बचें।',
    nearestShelter: 'निकटतम सुरक्षित आश्रय',
    safeRoute: 'सुरक्षित निकास मार्ग',
    sosButton: 'आपातकालीन एसओएस (SOS)',
    askAi: 'एआई वॉयस सहायक',
    emergencyCall: 'सीधा 112 कॉल',
    reportHazard: 'खतरे की सूचना दें',
    iAmSafe: 'मैं सुरक्षित हूँ',
    iAmSafeConfirmed: 'आपकी सुरक्षा स्थिति राहत रजिस्टर में दर्ज कर दी गई है।',
    findShelter: 'सुरक्षित आश्रय खोजें',
    findSafeRoute: 'सुरक्षित रास्ता देखें',
    criticalAlertHeader: 'अति-गंभीर आपदा चेतावनी',
    evacuateInstruction: 'तत्काल सुरक्षित निकासी आवश्यक है। उत्तरी राहत केंद्र के ऊंचे मार्ग का अनुसरण करें।',
    offlineBanner: 'कम नेटवर्क / ऑफलाइन मोड सक्रिय। सुरक्षा डाटा सुरक्षित है।',
    offlineQueuedNotice: 'एसओएस कतार में है। मोबाइल सिग्नल आते ही स्वतः प्रेषित होगा।',
    voiceHelpPrompt: 'माइक दबाकर बोलें: "क्या मैं खतरे में हूँ?", "निकटतम आश्रय कहाँ है?", "मुझे एम्बुलेंस चाहिए"',
    listening: 'आपकी आवाज सुनी जा रही है...',
    voiceMicStart: 'आपातकालीन प्रश्न बोलें',
    voiceMicStop: 'उत्तर तैयार हो रहा है...',
    selectLanguage: 'भाषा',
    emergencyType: 'आपात स्थिति का प्रकार चुनें',
    medical: 'चिकित्सा सहायता',
    fire: 'आग / अग्निकांड',
    flood: 'बाढ़ / पानी में फंसे',
    trapped: 'रास्ते में फंसे / छत पर',
    accident: 'सड़क या संरचना दुर्घटना',
    missingPerson: 'लापता व्यक्ति',
    rescueRequired: 'बचाव दल / नाव आवश्यक',
    otherEmergency: 'अन्य आपातकाल',
    confirmSos: 'कमांड सेंटर को SOS भेजें',
    sendingSos: 'आपातकालीन सिग्नल भेजा जा रहा है...',
    sosSentSuccess: 'आपकी सूचना जिला आपदा कमान केंद्र में दर्ज हुई।',
    realCallDisclaimer: 'सीधा 112 आपातकालीन डायलर खोलता है। कोई नकली कॉल नहीं बनाई जाती।',
    safeRoadStatus: 'ऊँचा और सुरक्षित मार्ग (जलभराव मुक्त)',
    distanceKm: 'किमी दूर',
    capacityLeft: 'बिस्तर खाली',
    openDirections: 'दिशा-निर्देश देखें',
  }
};
