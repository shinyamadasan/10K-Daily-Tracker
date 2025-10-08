// Public configuration for 10K Steps Tracker
// This file is safe to commit to GitHub (no sensitive data)

const CONFIG = {
  // App configuration (non-sensitive)
  participants: [
    "Del", "Giem", "Glaiz", "Jeun", "Joy", "Kokoy",
    "Leanne", "Lui", "Ramon", "Robert", "Sarah",
    "Sheila", "Shin", "Yohan", "Zephanny", "Sam"
  ],
  targetSteps: 10000,
  penaltyAmount: 50,
  
  // Payment details (non-sensitive - this is public info)
  paymentDetails: {
    name: "Ramon O.",
    number: "09060076691"
  }
};

// Load sensitive config from environment or use defaults
if (window.location.hostname === 'shinyamadasan.github.io') {
  // Production environment - load from environment variables or hardcode
  CONFIG.firebase = {
    apiKey: "AIzaSyCKlhnFEjsLQtVyaflX13med-6U9CGKQDA",
    authDomain: "steps-tracker-a27cd.firebaseapp.com",
    projectId: "steps-tracker-a27cd",
    storageBucket: "steps-tracker-a27cd.appspot.com",
    messagingSenderId: "544653738695",
    appId: "1:544653738695:web:45c89a9de3d4e8ba881755"
  };
  CONFIG.imgbbApiKey = "4c55000846fd9930038234d010f76cde";
  CONFIG.adminPassword = "steps2025";
} else {
  // Development environment - load from external file
  console.log('Development mode: Loading config from config.js');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}
