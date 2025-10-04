# 10K Steps Tracker - User Features Guide

## 📱 **For Regular Users (Everyone)**

### **1. Submit Your Daily Steps** 📊

**How to use:**
1. Go to **Submit Steps** tab
2. Select your name from dropdown
3. Choose the date
4. Enter your step count
5. Upload a screenshot as proof (from your fitness app)
6. Click **Submit**

**Features:**
- ✅ Automatic image compression (saves data)
- ✅ Prevents duplicate entries (shows error if already submitted)
- ✅ Clear error messages
- ✅ Auto-saves to cloud (Firebase)

**Example error messages:**
- "Please fill all fields" - Missing information
- "Del already has an entry for 10/4/2025!" - Already submitted for that date

---

### **2. View Daily Tracker** 📋

**What you see:**
- Complete history of all submissions
- Date, Name, Steps, Status, Proof, Amount Owed

**Filter options:**
- **Search by name** - Type to filter
- **Date range** - Select from/to dates
- **Clear filters** - Reset all filters

**Interactive features:**
- Click proof image to view full size
- See color-coded status:
  - 🟢 Green "Met" - Hit 10,000 steps
  - 🔴 Red "Missed" - Below 10,000 steps
- See penalties (₱50 per missed day)

---

### **3. Payment Summary** 💰

**Your personal stats:**
- **Total Days** - How many days you've tracked
- **Days Missed** - Days below 10,000 steps
- **Amount Owed** - Total penalties (₱50 × missed days)
- **Completion Rate** - Visual progress bar showing success %

**Pay Your Penalties:**

1. Click **"Settle"** button next to your name
2. Modal opens showing:
   - Amount you owe
   - GCash details: **Ramon O. - 09060076691**
   - Pre-written payment message
3. Click **"Copy Message"** to copy payment text
4. Send payment via GCash
5. Return to app, upload payment screenshot
6. Click **Submit Payment Proof**

**Status indicators:**
- 🔵 **"Settle"** - You need to pay
- ⏳ **"Pending Approval"** - Payment submitted, waiting for admin to verify
- ✅ **"Paid Up!"** - Payment approved, you're all clear

---

### **4. Challenge Leaderboard** 🏆

#### **Team Stats Section** 🌟

See how the whole team is doing:

- **Team Success Rate** - Overall percentage hitting 10K steps
- **Total Distance** - Combined kilometers walked by team
- **Total Calories** - Combined calories burned
- **Penalty Pool** - Total money collected from penalties
- **Team Goal Progress** - Visual progress bar

#### **Rankings Table**

**Columns explained:**

1. **Rank**
   - 🥇 Gold medal - 1st place
   - 🥈 Silver medal - 2nd place
   - 🥉 Bronze medal - 3rd place
   - Numbers for everyone else
   - Color-coded rows (gold/silver/bronze backgrounds)

2. **Name** - Your name

3. **Success Rate**
   - Percentage of days you hit 10,000 steps
   - Example: 85% = hit target 85% of the time

4. **Streak**
   - Consecutive days hitting 10,000 steps
   - Example: "7 🔥" = 7 days in a row

5. **Distance**
   - Total kilometers walked
   - Calculation: steps × 0.762m / 1000

6. **Best Day**
   - Your highest step count + the date
   - Example: "15,234 (Oct 1)"

7. **Achievements**
   - Badges you've earned (hover to see description):
     - 🔥 **On Fire** - 7+ day streak
     - 💪 **Beast Mode** - Hit 15,000+ steps in one day
     - 🎯 **Perfect Week** - 7 consecutive days hitting 10K
     - 🌟 **Consistency Champion** - 90%+ success rate with 7+ days

8. **Trend**
   - Your recent performance (last 3 days vs previous 3)
   - ↗ **Up** (green) - Improving! (+5% or more)
   - ↘ **Down** (red) - Declining (-5% or more)
   - → **Stable** (gray) - Steady performance

**How rankings work:**
- Sorted by **Success Rate** first
- If tied, sorted by **Total Steps**

---

### **5. Dashboard** 📈

**Visible to everyone!**

#### **⚠️ At-Risk Today**
Shows who hasn't submitted steps for today:
- 🟢 Green "✅ Everyone has submitted today!" - All good!
- 🟡 Yellow list of names - These people need to submit

#### **📊 This Week's Stats**
Past 7 days overview:
- **Total Submissions** - Number of entries this week
- **Success Rate** - % of submissions hitting 10K
- **Total Penalties** - Money owed from this week (₱)
- **Pending Payments** - How many payments waiting for approval

---

### **6. Install as Mobile App** 📲

**On Android (Chrome):**
1. Open https://shinyamadasan.github.io/10K-Daily-Tracker/
2. Tap menu (⋮)
3. Tap "Add to Home Screen" or "Install app"
4. App appears on home screen like a native app

**On iPhone (Safari):**
1. Open https://shinyamadasan.github.io/10K-Daily-Tracker/ in Safari
2. Tap Share button (□↑)
3. Tap "Add to Home Screen"
4. App appears on home screen

**Benefits:**
- ✅ Opens in fullscreen (no browser UI)
- ✅ Works like a real app
- ✅ Faster loading (cached)
- ✅ Easy access from home screen
- ✅ Works offline (view cached data)

---

## 🔑 **For Admins Only**

### **Enable Admin Mode**

1. Click **"🔐 Enable Admin Mode"** button (top right)
2. Enter password: **steps2025**
3. Button changes to **"🔓 Exit Admin Mode"**
4. Admin features become visible

---

### **Admin Feature 1: Edit/Delete Entries** ✏️

**In Daily Tracker tab:**
- **Edit** and **Delete** buttons appear on each row
- Click **Edit** to change step count
- Click **Delete** to remove entry (with confirmation)

**Use cases:**
- Fix typos in step counts
- Remove duplicate/test entries
- Correct wrong submissions

---

### **Admin Feature 2: Verify Payments** ✅

**In Payment Summary tab:**

When someone clicks "Settle" and uploads payment proof:

1. Their row shows payment proof image (thumbnail)
2. Admin sees **"Verify"** and **"Mark Paid"** buttons
3. Click **"Verify"** to view full payment screenshot
4. Click **"Approve"** in modal to confirm payment
   - OR click **"Mark Paid"** to approve without viewing

**What happens when approved:**
- All missed entries for that person → marked as paid
- Payment status → "approved"
- User sees "✅ Paid Up!"

---

### **Admin Feature 3: Export Data** 📥

**In Dashboard tab:**

1. Click **"Download CSV Report"** button
2. CSV file downloads with all data

**CSV includes:**
- Date
- Participant
- Steps
- Status (Met/Missed)
- Amount Owed (₱)
- Paid (Yes/No)

**Filename:** `steps-tracker-YYYY-MM-DD.csv`

**Use cases:**
- Backup data
- Analyze in Excel/Sheets
- Share with team
- Generate reports

---

### **Admin Dashboard** 📊

Same dashboard as regular users, plus:
- Export functionality
- Can see pending payment count
- Monitor team compliance

---

## 💡 **Tips & Tricks**

### **For Better Experience:**

1. **Install as app** for fastest access
2. **Submit daily** before midnight to avoid missing days
3. **Check At-Risk list** to see who needs reminders
4. **Aim for achievements** to get badges on leaderboard
5. **Build streaks** - consistency is key!

### **To Improve Your Ranking:**

1. **Hit 10K daily** - Increases success rate
2. **Build streaks** - Shows on leaderboard
3. **Go for 15K+** - Unlocks Beast Mode badge 💪
4. **Stay consistent** - 7+ days unlocks more badges

### **Payment Best Practices:**

1. **Pay promptly** when you miss days
2. **Keep payment receipt** before uploading
3. **Use the copy button** for payment message
4. **Upload clear screenshot** of GCash confirmation

---

## ❓ **Common Questions**

### **Q: Can I edit my submission after submitting?**
**A:** No, but an admin can edit it for you. Contact admin if you made a mistake.

### **Q: What if I forgot to submit yesterday?**
**A:** You can still submit for previous dates! Just select the date in the form.

### **Q: Can I submit for future dates?**
**A:** Yes, the app allows it, but please only submit actual completed days.

### **Q: How is distance calculated?**
**A:** Distance (km) = Total Steps × 0.762 meters / 1000
- Average adult stride length is 0.762m

### **Q: How are calories calculated?**
**A:** Calories = Total Steps × 0.04
- Average person burns ~0.04 calories per step

### **Q: What if my payment shows "Pending" for too long?**
**A:** Contact an admin to verify your payment. They might have missed the notification.

### **Q: Can I see other people's proof screenshots?**
**A:** Yes! Click any proof image in the Daily Tracker to view full size.

### **Q: How do achievements work?**
**A:** Achievements unlock automatically when you meet criteria:
- 🔥 On Fire: 7+ day streak
- 💪 Beast Mode: Any day with 15K+ steps
- 🎯 Perfect Week: 7 consecutive days hitting target
- 🌟 Consistency: 90%+ success rate over 7+ days

### **Q: Does the app work offline?**
**A:** Partially. You can view cached data, but you need internet to:
- Submit new entries
- Upload images
- See latest updates from others

### **Q: What browsers work best?**
**A:**
- **Mobile:** Chrome (Android), Safari (iPhone)
- **Desktop:** Chrome, Edge, Firefox, Safari - all work

---

## 🎯 **Challenge Goals**

### **Personal Goals:**
- ✅ Hit 10,000 steps every day
- ✅ Build a 7+ day streak
- ✅ Unlock all achievement badges
- ✅ Reach 90%+ success rate
- ✅ Zero penalties owed

### **Team Goals:**
- 🌟 Team success rate above 80%
- 🏃 Combined 100+ km walked per week
- 💪 Everyone earns at least one badge
- 🎯 Everyone submits on time (no at-risk)

---

## 📞 **Support**

### **App Issues:**
- Check your internet connection
- Try refreshing the page
- Clear browser cache
- Reinstall app if needed

### **Payment Issues:**
- Contact admin for verification
- Ensure you uploaded clear screenshot
- Check GCash details are correct

### **Technical Problems:**
- Report to admin
- Include screenshot of error if possible

### **GCash Payment Details:**
- **Name:** Ramon O.
- **Number:** 09060076691

---

## 🎉 **Get Started!**

Ready to track your steps? Here's your first steps:

1. ✅ Open https://shinyamadasan.github.io/10K-Daily-Tracker/
2. ✅ Install as app on your phone
3. ✅ Submit your first step entry
4. ✅ Check the leaderboard to see rankings
5. ✅ Aim for a 7-day streak to earn your first badge!

**Good luck with the 10K Steps Challenge!** 🚶‍♀️🚶‍♂️💪

---

**Last Updated:** October 4, 2024
**App Version:** 2.0
