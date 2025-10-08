// Configuration Template for 10K Steps Tracker
// Copy this file to config.js and fill in your actual values
// DO NOT commit config.js to version control

const CONFIG = {
  // Firebase Configuration
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  },

  // ImgBB API Key for image uploads
  imgbbApiKey: "YOUR_IMGBB_API_KEY",

  // Admin password for admin mode
  adminPassword: "YOUR_ADMIN_PASSWORD",

  // Payment details
  paymentDetails: {
    name: "YOUR_NAME",
    number: "YOUR_PHONE_NUMBER"
  },

  // App configuration
  participants: [
    "Participant1", "Participant2", "Participant3"
    // Add your participants here
  ],
  targetSteps: 10000,
  penaltyAmount: 50
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}
