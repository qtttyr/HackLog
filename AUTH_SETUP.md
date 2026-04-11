# HackLog Auth Setup Guide

## Current Status ✅

The authentication system is **fully operational without requiring a backend**. The frontend connects directly to Supabase for email/password authentication.

### What Works Without Backend
- ✅ User registration (email/password)
- ✅ User login (email/password)  
- ✅ Session persistence across page reloads
- ✅ Automatic redirects (auth → onboarding → dashboard)
- ✅ Team workspace setup
- ✅ Data persistence in localStorage

### Architecture

```
Registration/Login Flow:
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│  Frontend (React)        │
│  - Auth Page             │
│  - Supabase JS Client    │
└──────┬───────────────────┘
       │ (Direct Connection)
       ▼
┌──────────────────────────┐
│  Supabase Auth           │
│  - Email/Password Auth   │
│  - Session Management    │
│  - JWT Token Generation  │
└──────────────────────────┘
```

**No backend required** - Supabase handles all authentication.

---

## Prerequisites

1. **Supabase Project Access**
   - You already have: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - These are in: `frontend/.env`

2. **Supabase Configuration Required**
   - Email verification needs to be **disabled** for instant signup
   - See section below for instructions

---

## Supabase Configuration: Disable Email Verification

### Why?
To allow instant signup without email verification (perfect for hackathons where users need fast access).

### Steps:

1. **Go to Supabase Dashboard**
   - Open: https://app.supabase.com
   - Select your project: `mwskpuicxzkrvctmcvgk`

2. **Navigate to Authentication Settings**
   - In left sidebar: **Authentication** → **Providers**
   - Click on **Email** provider

3. **Disable Email Confirmation**
   - Find the setting: **Confirm email**
   - Change from **Enabled** to **Disabled**
   - Save changes

4. **Verify Settings**
   - **User creation:** Enabled (allows any user to create account)
   - **Enable Standard OAuth:** Disabled (we're using email/password only)
   - **Autoconfirm user:** Enabled (auto-confirms accounts)

### Result
After these changes:
- Users can sign up with email/password instantly
- No email verification required
- Session is created immediately
- User redirected to onboarding → dashboard

---

## Testing Auth Flow

### 1. Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
Runs on: `http://localhost:5173`

### 2. Test Signup
1. Go to `http://localhost:5173`
2. Click **Register**
3. Enter: email, password, name
4. Click **Create account**
5. **Expected:** Instantly redirected to onboarding page

### 3. Test Onboarding
Complete the 4-step onboarding:
1. **Team Setup** - Enter project name + team members
2. **Hackathon Info** - Enter hackathon details
3. **Project Idea** - Describe your project
4. **Ready** - Click "Go to Dashboard"

### 4. Verify Dashboard Access
- Should see dashboard with tasks, decisions, etc.
- Bottom navigation works (Tasks, Board, Roadmap, Settings)
- Mobile viewport shows correct safe areas

### 5. Test Session Persistence
1. After login, refresh the page (Cmd/Ctrl + R)
2. **Expected:** Session persists, no redirect to login
3. User stays on dashboard

### 6. Test Login
1. Open new incognito window
2. Go to `http://localhost:5173`
3. Sign in with same email/password used in signup
4. **Expected:** Redirected to dashboard (already onboarded)

### 7. Test Mobile Responsiveness
1. Open DevTools (F12 or Cmd+Shift+I)
2. Toggle device toolbar (responsive design mode)
3. Test on:
   - iPhone 14 Pro (390x844)
   - iPad (768x1024)
   - Samsung Galaxy S21 (360x800)
4. **Verify:** Safe areas work, bottom nav visible, no overflow

---

## Auth Flow Details

### Signup Flow
```
User enters email/password
         ↓
Supabase auth.signUp()
         ↓
Account created (auto-confirmed)
         ↓
Session available immediately
         ↓
Frontend redirects to /onboarding
         ↓
(500ms delay to ensure auth state syncs)
         ↓
Onboarding page loads
```

### Login Flow
```
User enters email/password
         ↓
Supabase auth.signInWithPassword()
         ↓
Session created with JWT token
         ↓
Frontend checks isOnboarded flag
         ↓
If false → /onboarding
If true → /dashboard
```

### Session Check
```
Every page load:
         ↓
useSession() hook runs
         ↓
Gets session from Supabase auth
         ↓
Tries to verify with backend (if available)
         ↓
Falls back to Supabase session if backend unavailable
         ↓
Router updates based on session + onboarding state
```

---

## Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=https://mwskpuicxzkrvctmcvgk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
# VITE_API_BASE_URL - commented out (not needed for Phase 1)
```

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Anonymous key for client-side auth
- Backend URL commented out since no backend needed for Phase 1

---

## Troubleshooting

### Issue: "Signup doesn't work"
**Solution:**
1. Check Supabase email verification is disabled
2. Open browser DevTools → Console → look for errors
3. Check Network tab → requests to Supabase API

### Issue: "Can't login after signup"
**Solution:**
1. Verify email confirmation is disabled in Supabase
2. Check that password was saved correctly
3. Ensure VITE_SUPABASE_URL is correct in .env

### Issue: "Session lost after page refresh"
**Solution:**
1. Check localStorage in DevTools → Application tab
2. Look for key: `hacklog-team-state`
3. Supabase automatically persists session in localStorage

### Issue: "Mobile viewport shows issues"
**Solution:**
1. Check `frontend/styles/globals.css` for safe-area-inset
2. Verify BottomNav has `safe-area-inset-b` class
3. Test on actual device (DevTools mobile view sometimes unreliable)

### Issue: "Backend errors when backend not running"
**Solution:**
1. This is expected! Backend is commented out in .env
2. Frontend gracefully falls back to Supabase session
3. Check console logs to verify fallback is working

---

## Key Files

### Frontend Auth
- `frontend/src/lib/supabase.ts` - Supabase client initialization
- `frontend/src/features/auth/auth-page.tsx` - Login/signup UI
- `frontend/src/hooks/use-session.ts` - Session query hook (with backend fallback)
- `frontend/src/app/providers.tsx` - Auth state listener
- `frontend/src/app/router.tsx` - Protected routes and redirects

### State Management
- `frontend/src/store/ui-store.ts` - Zustand store with persist middleware
  - Stores: mode (solo/team), team data, onboarding status
  - Persists to localStorage automatically

### Configuration
- `frontend/.env` - Environment variables
  - Supabase credentials
  - Backend URL (commented for Phase 1)

---

## Next Steps

### Immediate (Right Now)
1. ✅ Disable email verification in Supabase
2. ✅ Test signup flow
3. ✅ Test login flow
4. ✅ Test session persistence

### Phase 2 (Canvas Board - Later)
- Enable backend for AI features
- Fill backend .env with:
  - SUPABASE_SERVICE_KEY (for server-side auth)
  - GEMINI_API_KEY (for AI features)
  - SUPABASE_JWT_SECRET (for token verification)
- Start backend with: `uvicorn app.main:app --reload`

---

## Security Notes

### Current Setup (Phase 1)
- ✅ Supabase handles password hashing
- ✅ Passwords never sent to backend (direct to Supabase)
- ✅ Sessions use JWT tokens (verified by Supabase)
- ✅ VITE_SUPABASE_ANON_KEY is public (it's meant to be)
  - Limited permissions by Supabase RLS policies
  - Can only authenticate users

### When Backend Starts (Phase 2)
- Will add backend authentication verification
- Backend will validate JWT tokens
- Backend will check Supabase RLS policies
- API endpoints will require valid session

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start frontend | `cd frontend && npm run dev` |
| Open app | `http://localhost:5173` |
| Open Supabase dashboard | `https://app.supabase.com` |
| Clear auth in browser | DevTools → Application → Clear site data |
| Check session in localStorage | DevTools → Application → localStorage |

---

## Questions?

If something doesn't work:
1. Check browser console (DevTools → Console)
2. Check Network tab for Supabase API calls
3. Verify email confirmation is disabled in Supabase
4. Try clearing site data and starting fresh
5. Check this file again for troubleshooting section
