export type Language = 'en' | 'hi';

export interface TimelineEntry {
  month: number;
  caption: string;
  text: string;
  image: string;
}

export interface ContentSection {
  languageSelect: {
    subtitle: string;
    heading: string;
    english: string;
    hindi: string;
  };
  welcome: {
    subtitle: string;
    name: string;
    occasion: string;
    scrollHint: string;
  };
  hero: {
    title: string;
    subtitle: string;
    date: string;
    tagline: string;
  };
  timeline: TimelineEntry[];
  invitation: {
    heading: string;
    message: string;
    quote: string;
    quoteAttribution: string;
  };
  event: {
    heading: string;
    dateLabel: string;
    date: string;
    timeLabel: string;
    time: string;
  };
  dinner: {
    heading: string;
    message: string;
    icon: string;
  };
  venue: {
    heading: string;
    address: string;
    directions: string;
  };
  blessings: {
    heading: string;
    message: string;
  };
  gift: {
    heading: string;
    message: string;
  };
  closing: {
    message: string;
    withLove: string;
    from: string;
    year: string;
  };
}

export const content: Record<Language, ContentSection> = {
  en: {
    languageSelect: {
      subtitle: "Vedika's Birthday",
      heading: "Choose your language",
      english: "English",
      hindi: "हिन्दी",
    },
    welcome: {
      subtitle: "You're invited to celebrate",
      name: "Vedika",
      occasion: "First Birthday",
      scrollHint: "Scroll to begin her story",
    },
    hero: {
      title: "A Year of Love",
      subtitle: "Vedika's First Birthday Celebration",
      date: "28 June",
      tagline: "Every month, a new chapter of joy",
    },
    timeline: [
      { month: 0, caption: "New Beginnings", text: "When the world welcomed a little miracle", image: "/images/landing page pic.png" },
      { month: 1, caption: "One Month of Wonder", text: "Tiny fingers, endless wonder", image: "/images/1 month.jpg" },
      { month: 2, caption: "Two Months of Joy", text: "Every smile, a new discovery", image: "/images/2 month.jpg" },
      { month: 3, caption: "Three Months of Love", text: "Growing more beautiful each day", image: "/images/3 month.jpg" },
      { month: 4, caption: "Four Months of Smiles", text: "Laughter filling our hearts", image: "/images/4 month.jpg" },
      { month: 5, caption: "Five Months of Curiosity", text: "Curious eyes exploring the world", image: "/images/5 month.png" },
      { month: 6, caption: "Halfway to One", text: "Six months of pure magic", image: "/images/6 month.png" },
      { month: 7, caption: "Seven Months of Joy", text: "Sitting up, reaching out to the world", image: "/images/7 month.jpg" },
      { month: 8, caption: "Eight Months of Adventure", text: "Every day a new milestone", image: "/images/8 month.jpg" },
      { month: 9, caption: "Nine Months of Love", text: "Crawling straight into our hearts", image: "/images/9 month.jpg" },
      { month: 10, caption: "Ten Months of Delight", text: "A little personality blooming", image: "/images/10 month - Copy.jpg" },
      { month: 11, caption: "Almost One", text: "Eleven months of love and counting", image: "/images/11 month.jpg" },
    ],
    invitation: {
      heading: "You're Invited",
      message: "Join us as we celebrate Vedika's special day with love, laughter, and blessings. It would mean the world to have you there as she turns one.",
      quote: "Your love, blessings, and presence will make my birthday truly special.",
      quoteAttribution: "— Vedika",
    },
    event: {
      heading: "Celebration Details",
      dateLabel: "Date",
      date: "28 June",
      timeLabel: "Time",
      time: "7:00 p.m.",
    },
    dinner: {
      heading: "Dinner",
      message: "Dinner will be hosted after the celebration. We would love for you to stay and share a meal with us.",
      icon: "🍽",
    },
    venue: {
      heading: "Venue",
      address: "Flat No. 006, Ground Floor, H Wing,\nRustomjee Avenue L4, Opposite Club One,\nGlobal City, Dongarpada,\nVirar West – 401303, Maharashtra, India",
      directions: "Get Directions",
    },
    blessings: {
      heading: "Blessings",
      message: "We eagerly await your warm presence and loving blessings to make this celebration truly memorable for our little one.",
    },
    gift: {
      heading: "A Note on Gifts",
      message: "Please do not bring any gift. Your presence and blessings are the most valuable gift for me.",
    },
    closing: {
      message: "Your presence will make this day truly special for our little one.",
      withLove: "With love,",
      from: "Vedika & Family",
      year: "2025",
    },
  },
  hi: {
    languageSelect: {
      subtitle: "वेदिका का जन्मदिन",
      heading: "अपनी भाषा चुनें",
      english: "English",
      hindi: "हिन्दी",
    },
    welcome: {
      subtitle: "आपको निमंत्रण है",
      name: "वेदिका",
      occasion: "पहला जन्मदिन",
      scrollHint: "उनकी कहानी शुरू करने के लिए स्क्रॉल करें",
    },
    hero: {
      title: "प्रेम का एक साल",
      subtitle: "वेदिका के पहले जन्मदिन की उत्सव",
      date: "28 जून",
      tagline: "हर महीने, खुशी का एक नया अध्याय",
    },
    timeline: [
      { month: 0, caption: "नई शुरुआत", text: "जब दुनिया ने एक छोटे से चमत्कार का स्वागत किया", image: "/images/landing page pic.png" },
      { month: 1, caption: "एक माह का अचंभा", text: "नन्ही उंगलियाँ, अनंत आश्चर्य", image: "/images/1 month.jpg" },
      { month: 2, caption: "दो माह की खुशी", text: "हर मुस्कान, एक नई खोज", image: "/images/2 month.jpg" },
      { month: 3, caption: "तीन माह का प्रेम", text: "हर दिन और भी सुंदर होती गई", image: "/images/3 month.jpg" },
      { month: 4, caption: "चार माह की मुस्कानें", text: "ठहाकों से हमारे दिल भर आते", image: "/images/4 month.jpg" },
      { month: 5, caption: "पाँच माह की जिज्ञासा", text: "जिज्ञासु आँखें दुनिया को देखती गईं", image: "/images/5 month.png" },
      { month: 6, caption: "एक साल के आधे रास्ते पर", text: "छह माह का शुद्ध जादू", image: "/images/6 month.png" },
      { month: 7, caption: "सात माह की खुशी", text: "बैठना, दुनिया को थामना", image: "/images/7 month.jpg" },
      { month: 8, caption: "आठ माह का साहसिक", text: "हर दिन एक नई उपलब्धि", image: "/images/8 month.jpg" },
      { month: 9, caption: "नौ माह का प्रेम", text: "सीधे हमारे दिलों में रंगती गई", image: "/images/9 month.jpg" },
      { month: 10, caption: "दस माह का उत्साह", text: "एक नन्ही सी पहचान खिलती गई", image: "/images/10 month - Copy.jpg" },
      { month: 11, caption: "एक साल के बहुत करीब", text: "ग्यारह माह का प्रेम, और गिनती जारी", image: "/images/11 month.jpg" },
    ],
    invitation: {
      heading: "आपको निमंत्रण है",
      message: "आइए, हमारे साथ वेदिका के विशेष दिन की खुशियों, प्रेम और आशीर्वाद में शामिल हों। वेदिका के पहले जन्मदिन पर आपकी उपस्थिति सबसे अनमोल होगी।",
      quote: "आपका प्रेम, आशीर्वाद और उपस्थिति ही मेरे जन्मदिन को सच में खास बना देगी।",
      quoteAttribution: "— वेदिका",
    },
    event: {
      heading: "उत्सव की विवरणी",
      dateLabel: "तिथि",
      date: "28 जून",
      timeLabel: "समय",
      time: "शाम 7:00 बजे",
    },
    dinner: {
      heading: "रात्रिभोज",
      message: "उत्सव के बाद रात्रिभोज का आयोजन किया जाएगा। हम चाहेंगे कि आप हमारे साथ बने रहें और भोजन साझा करें।",
      icon: "🍽",
    },
    venue: {
      heading: "स्थान",
      address: "फ्लैट नं. 006, ग्राउंड फ्लोर, H विंग,\nरुस्तोमजी एवेन्यू L4, क्लब वन के सामने,\nग्लोबल सिटी, डोंगरपाडा,\nविरार पश्चिम – 401303, महाराष्ट्र, भारत",
      directions: "रास्ता खोजें",
    },
    blessings: {
      heading: "आशीर्वाद",
      message: "हमारी नन्ही वेदिका के लिए इस उत्सव को सच में यादगार बनाने के लिए हम आपकी स्नेहिल उपस्थिति और प्रेमपूर्ण आशीर्वाद की प्रतीक्षा कर रहे हैं।",
    },
    gift: {
      heading: "उपहार के बारे में",
      message: "कृपया कोई उपहार न लाएं। आपकी उपस्थिति और आशीर्वाद ही मेरे लिए सबसे अनमोल उपहार है।",
    },
    closing: {
      message: "आपकी उपस्थिति हमारी नन्ही वेदिका के लिए इस दिन को सच में खास बना देगी।",
      withLove: "प्रेम सहित,",
      from: "वेदिका और परिवार",
      year: "2025",
    },
  },
};

// Google Maps embed URL
export const MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16162.241061099345!2d72.81609734999999!3d19.48166535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7abb5b07f67c9%3A0x9a71b78d4ace991f!2sRustomjee%20Avenue%20L1%2C%20L2%20%26%20L4!5e1!3m2!1sen!2sin!4v1781353337724!5m2!1sen!2sin";

// Google Maps directions link
export const MAPS_DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=Rustomjee+Avenue+L4+Global+City+Dongarpada+Virar+West+Maharashtra";

// Photo paths - these match the actual files in public/images/
export const PHOTO_PLACEHOLDERS = [
  "/images/landing page pic.png",
  "/images/1 month.jpg",
  "/images/2 month.jpg",
  "/images/3 month.jpg",
  "/images/4 month.jpg",
  "/images/5 month.png",
  "/images/6 month.png",
  "/images/7 month.jpg",
  "/images/8 month.jpg",
  "/images/9 month.jpg",
  "/images/10 month - Copy.jpg",
  "/images/11 month.jpg",
];
