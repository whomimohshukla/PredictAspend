# FocusZen - A Personal Productivity & Focus Tracker

FocusZen is a productivity-enhancing application designed to help individuals develop strong focus habits, reduce distractions, and gain insights into their daily work patterns. It blends time tracking, AI feedback, and distraction logging to promote deep work and build consistency.

## ✨ Features

### 🔒 User Authentication

-  Email-based signup/login
-  Secure password storage

### 🕒 Focus Sessions

-  Start/stop timer with session types: Pomodoro, Custom, Deep Work
-  Logs distractions and mood during sessions

### 📊 Daily Analytics

-  Track total focus time per day
-  View distraction count and streaks
-  Continue productivity streaks for daily consistency

### 🚫 Distraction Tracking

-  Log interruptions with timestamp, reason, and active tab URL (if integrated with extension)

### 🎯 Goal Setting

-  Set and monitor daily focus minute goals
-  AI detects streak breaks and prompts motivational feedback

### 🧠 AI-Based Suggestions

-  After each day/session, receive personalized feedback based on focus quality and trends

### ✅ Task Manager

-  Create and manage to-dos with optional due dates
-  Associate tasks with focus sessions

### 🌐 Website Blocker (Optional Extension)

-  Users can add URLs to be blocked during sessions
-  Future scope: Chrome Extension to enforce focus time

## 📁 Project Structure

### Models (Mongoose + TypeScript)

-  `User` - basic profile + goal/streak tracking
-  `FocusSession` - individual sessions with type, duration, mood
-  `DistractionLog` - logs of interruptions during focus
-  `DailyStat` - aggregated daily insights
-  `AIFeedback` - GPT/LLM-driven guidance
-  `BlockedWebsite` - user-defined blocked URLs
-  `Task` - simple task manager integrated with focus session

## 🚀 How It Works

1. Users sign in and start a focus session.
2. Distractions can be manually logged (or tracked via future extension).
3. On session end, the app calculates duration and logs stats.
4. Daily stats are saved and streaks updated.
5. AI provides suggestions to improve performance.
6. Tasks can be tracked and linked to sessions.

## 🔧 Technologies

-  **Backend**: Node.js + Express
-  **Database**: MongoDB (Mongoose)
-  **Language**: TypeScript
-  **AI Feedback**: OpenAI GPT / Custom LLM
-  **Optional**: Chrome Extension for blocking

## 📦 Future Improvements

-  Chrome Extension for real-time distraction blocking
-  Leaderboard and community challenges
-  Pomodoro timer with visual UI
-  Real-time analytics dashboard
-  Notification/reminder system

## 📜 License

MIT

---

Stay focused. Beat distractions. Build consistency with **FocusZen** 🧘
