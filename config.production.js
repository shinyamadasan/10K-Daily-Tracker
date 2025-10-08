// Production Configuration for Live Domain
// This file contains the actual API keys for the live deployment

const CONFIG = {
  firebase: {
    apiKey: "AIzaSyBdCrKuCM0DQ9lsA-tIio1575qI7GSoiYM",
    authDomain: "steps-tracker-a27cd.firebaseapp.com",
    projectId: "steps-tracker-a27cd",
    storageBucket: "steps-tracker-a27cd.appspot.com",
    messagingSenderId: "544653738695",
    appId: "1:544653738695:web:45c89a9de3d4e8ba881755"
  },
  imgbbApiKey: "601157688cb9690d732378e8a4f948c8",
  adminPassword: "steps2026",
  paymentDetails: {
    name: "Ramon O.",
    number: "09060076691"
  },
  participants: [
    "Del", "Giem", "Glaiz", "Jeun", "Joy", "Kokoy",
    "Leanne", "Lui", "Ramon", "Robert", "Sarah",
    "Sheila", "Shin", "Yohan", "Zephanny", "Sam"
  ],
  targetSteps: 10000,
  penaltyAmount: 50
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}
