# 🔒 Security Guide for 10K Steps Tracker

## ⚠️ **CRITICAL: Your API Keys Were Exposed!**

Your Firebase API keys and other sensitive information were exposed in your GitHub repository. **You must take immediate action to secure your application.**

## 🚨 **IMMEDIATE ACTIONS REQUIRED:**

### 1. **Regenerate Firebase API Keys**

**Method 1: Google Cloud Console (Recommended)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the correct project: `steps-tracker-a27cd`
3. Go to **APIs & Services** → **Credentials**
4. Look for **"API Keys"** section
5. Find your Firebase API key (it will show as "Browser key" or "Server key")
6. Click on the key to edit it
7. **Set Application Restrictions:**
   - Select **"Websites"** 
   - Add your domain: `https://shinyamadasan.github.io/*`
   - **Note:** localhost/127.0.0.1 are not allowed in website restrictions
8. **Set API Restrictions:**
   - Keep **"Restrict key"** selected
   - Make sure these APIs are enabled:
     - Firebase Realtime Database Management API
     - Firebase Hosting API
     - Firebase Rules API
     - Cloud Firestore API
     - Firebase Management API
9. Click **"Rotate key"** button
10. Confirm the regeneration
11. Copy the new API key

**Method 2: Firebase Console (Alternative)**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `steps-tracker-a27cd`
3. Go to **Project Settings** (gear icon) → **General** tab
4. Scroll down to **"Your apps"** section
5. If you see your web app, click the **⚙️ settings icon** next to it
6. Look for the **firebaseConfig** object - the API key is there
7. If you don't see a web app, you may need to add one first

**Method 3: Add New Web App (If no web app exists)**
1. In Firebase Console → Project Settings → General tab
2. Scroll to **"Your apps"** section
3. Click **"Add app"** → **Web** (</> icon)
4. Register your app with a nickname like "10K Steps Tracker"
5. Copy the **firebaseConfig** object that appears
6. This will give you a fresh API key

### 2. **Regenerate ImgBB API Key**
1. Go to [ImgBB API Dashboard](https://api.imgbb.com/)
2. Log in to your account
3. Go to **API Keys** section
4. Generate a new API key
5. Delete the old one

### 3. **Change Admin Password**
1. Edit `app.js` line 12
2. Change `adminPassword: 'steps2025'` to a new secure password
3. Update the password in your documentation

### 4. **Update Your Code**
1. Copy `config.template.js` to `config.js`
2. Fill in your new API keys and credentials
3. Update `index.html` and `app.js` to use the config file
4. **DO NOT commit `config.js` to GitHub**

## 🔧 **How to Implement Secure Configuration:**

### Step 1: Create Your Config File
```bash
cp config.template.js config.js
```

### Step 2: Edit config.js with Your Real Values
```javascript
const CONFIG = {
  firebase: {
    apiKey: "your-new-firebase-api-key",
    authDomain: "steps-tracker-a27cd.firebaseapp.com",
    projectId: "steps-tracker-a27cd",
    storageBucket: "steps-tracker-a27cd.appspot.com",
    messagingSenderId: "544653738695",
    appId: "1:544653738695:web:45c89a9de3d4e8ba881755"
  },
  imgbbApiKey: "your-new-imgbb-api-key",
  adminPassword: "your-new-secure-password",
  paymentDetails: {
    name: "Ramon O.",
    number: "09060076691"
  }
};
```

### Step 3: Update index.html
Replace the hardcoded Firebase config with:
```javascript
// Load config from external file
const script = document.createElement('script');
script.src = './config.js';
script.onload = () => {
  const firebaseConfig = window.CONFIG.firebase;
  // ... rest of your Firebase initialization
};
document.head.appendChild(script);
```

### Step 4: Update app.js
Replace hardcoded values with:
```javascript
const IMGBB_API_KEY = window.CONFIG.imgbbApiKey;
const adminPassword = window.CONFIG.adminPassword;
```

## 🔒 **API Key Restrictions (IMPORTANT!)**

### **Application Restrictions:**
Set these to prevent unauthorized use of your API key:

1. **Select "Websites"** in Application Restrictions
2. **Add your domain:**
   - `https://shinyamadasan.github.io/*` (your live app)
   - **Note:** localhost/127.0.0.1 are not allowed in website restrictions
3. **Remove "None"** - this allows anyone to use your key!

### **API Restrictions:**
Limit which Google services your key can access:

1. **Keep "Restrict key" selected**
2. **Enable only these APIs:**
   - ✅ Cloud Firestore API (for your database)
   - ✅ Firebase Realtime Database Management API
   - ✅ Firebase Hosting API
   - ✅ Firebase Rules API
   - ✅ Firebase Management API
3. **Remove any unnecessary APIs** to minimize attack surface

### **Why This Matters:**
- **Without restrictions:** Anyone with your API key can use it from any website
- **With restrictions:** Key only works from your specific domain
- **API limits:** Prevents abuse of other Google services

### **For Local Development:**
Since localhost/127.0.0.1 aren't allowed in website restrictions, you have two options:

**Option 1: Create a separate API key for development**
1. Create a new API key in Google Cloud Console
2. Set Application Restrictions to "None" (for localhost only)
3. Use this key only for local development

**Option 2: Use your live domain for testing**
- Test your app directly on `https://shinyamadasan.github.io/*`
- This is actually more realistic for testing anyway

## 🛡️ **Security Best Practices:**

### 1. **Never Commit Sensitive Data**
- ✅ Use `.gitignore` to exclude config files
- ✅ Use environment variables for production
- ✅ Use placeholder values in documentation
- ❌ Never commit API keys, passwords, or tokens

### 2. **Firebase Security Rules**
Your current rules allow public access. Consider restricting:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /entries/{document} {
      // Only allow from your domain
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. **Domain Restrictions**
In Firebase Console → Authentication → Settings:
- Add only your domain: `shinyamadasan.github.io`
- Remove `localhost` for production

### 4. **Regular Security Audits**
- Review your repository for exposed secrets
- Use tools like `git-secrets` or `truffleHog`
- Rotate API keys regularly
- Monitor Firebase usage for unusual activity

## 📋 **Checklist After Fixing:**

- [ ] Firebase API key regenerated
- [ ] ImgBB API key regenerated  
- [ ] Admin password changed
- [ ] config.js created with real values
- [ ] config.js added to .gitignore
- [ ] Code updated to use config file
- [ ] Documentation updated with placeholders
- [ ] Old API keys deactivated
- [ ] Repository cleaned of sensitive data
- [ ] Team notified of new credentials

## 🆘 **If You Need Help:**

1. **Firebase Issues:** Check [Firebase Documentation](https://firebase.google.com/docs)
2. **ImgBB Issues:** Check [ImgBB API Docs](https://api.imgbb.com/)
3. **Git Issues:** Use `git filter-branch` to remove sensitive data from history

## ⚡ **Quick Commands:**

```bash
# Remove sensitive files from git history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch config.js' \
  --prune-empty --tag-name-filter cat -- --all

# Force push to update remote
git push origin --force --all
```

---

**Remember:** Security is an ongoing process. Regularly audit your code and rotate credentials!
