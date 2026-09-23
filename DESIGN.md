# Daily Routes - Complete Design Document

## 🎯 Project Overview

**Daily Routes** is a hardcore, fast-paced Node.js learning platform where developers sharpen their skills by building one backend API route per day. Over 30 days, they build a complete blog platform (users, posts, comments, likes) using Node.js, Express, and PostgreSQL.

**Core Philosophy**: Learn by doing. No hand-holding. Real-world complexity from Day 1.

---

## 📋 Complete Design Decisions

### Round 1: Foundation (Q1-Q12)

#### Q1 - Project Type
**Decision**: Web application — course platform

#### Q2 - Target Audience
**Decision**: Developers (backend, full-stack, learning Node.js/Express/PostgreSQL)

#### Q3 - Primary Goal
**Decision**: Sharpen skills by building one backend route/API per day

#### Q4 - Scope & Complexity
**Decision**: Minimal (focused on core learning experience)

#### Q5 - Aesthetic & Vibe
**Decision**: Dark & technical (developer-focused, terminal-inspired)

#### Q6 - Core Mechanic
**Decision**: **C** — Daily unlock + binge option (flexible with streaks)
- New challenge unlocks daily at midnight local time
- Developers can binge ahead if they want
- Streak tracking encourages daily practice

#### Q7 - Route Challenge Structure
**Decision**: **Mix of A, B, C** — Different challenge types across 30 days
- **Type A**: Write this route (given spec)
- **Type B**: Debug this broken route
- **Type C**: Design schema + route + validation together

#### Q8 - Progression Model
**Decision**: **D** — Real project (blog platform)
- Each route builds on the last
- By Day 30, they've built a complete production API
- Users → Posts → Comments → Likes

#### Q9 - Execution Environment
**Decision**: **A** — In-browser editor
- Lowest friction
- Reuse executor infrastructure from Node.js Academy
- No setup required

#### Q10 - Validation
**Decision**: **B** — Simulated HTTP requests
- Send fake requests to their route
- Check status codes and JSON responses
- Teaches real API behavior

#### Q11 - Streak & Motivation
**Decision**: **B** — Streak counter + badges
- Proven motivators
- No leaderboard (can be demotivating)

#### Q12 - Content Scope
**Decision**: **C** — 30 challenges (one month)
- Enough to build a habit
- Can expand later

---

### Round 2: Learning Design (Q13-Q19)

#### Q13 - Route Layer Depth
**Decision**: **C** — All layers from Day 1
- Route handler + validation + error handling + database + business logic
- Hardcore approach: full complexity immediately
- Developers learn all layers together

#### Q14 - Daily Challenge Format
**Decision**: **A** — Minimal spec
- Just the spec: "Build GET /users/:id that returns user from DB"
- No hand-holding
- Developers figure out the details

#### Q15 - Database Schema
**Decision**: **B** — Always design
- They design the schema + write the route
- Tests full-stack thinking
- No schema provided

#### Q16 - Validation Feedback
**Decision**: **B** — Detailed
- Show exact request sent
- Show response received
- Show expected response
- "We sent GET /users/42, you returned 404, we expected 200 with {id: 42, name: 'Alice'}"

#### Q17 - Solution Reveal
**Decision**: **D** — After 3 failed attempts
- Prevent frustration
- Encourage struggle before seeing answer
- Respects autonomy

#### Q18 - Real Project Theme
**Decision**: **A** — Blog platform
- Users, posts, comments, likes
- Universally understood
- Clear relationships
- Covers all CRUD + auth + validation

#### Q19 - Streak Mechanics
**Decision**: **C** — Calendar-day based
- Consecutive calendar days = streak
- Miss a day = streak resets
- Forgiving (can do challenge anytime during the day)

---

### Round 3: Implementation Details (Q20-Q26)

#### Q20 - Challenge Difficulty Progression
**Decision**: **C** — Performance & optimization
- Day 1: basic queries
- Day 30: indexes, pagination, caching
- Difficulty increases via optimization challenges

#### Q21 - Starter Code
**Decision**: **A** — Completely blank
- Write everything from scratch
- No boilerplate
- Maximum learning

#### Q22 - Test Cases
**Decision**: **B** — 3-5 tests per challenge
- Happy path + edge cases
- Comprehensive but not overwhelming

#### Q23 - Error Messages
**Decision**: **B** — Educational
- "Your route returned 404. This usually means the user doesn't exist in the database. Check your SELECT query."
- Teaches while debugging

#### Q24 - Badge System
**Decision**: **D** — All types
- **Streak badges**: 7-day, 30-day, 100-day
- **Skill badges**: CRUD Master, Validation Expert, Error Handling Pro
- **Achievement badges**: First Route, 10 Routes, Blog Platform Complete

#### Q25 - Daily Challenge Unlock Time
**Decision**: **B** — Midnight local time
- Based on user's timezone
- Intuitive ("I'll do today's challenge tomorrow morning")
- Respects their schedule

#### Q26 - Challenge Review
**Decision**: **B** — Can review, but can't re-earn streak
- Review past challenges for learning
- Can't game the streak system
- Balances flexibility with integrity

---

### Round 4: Platform Implementation (Q27-Q33)

#### Q27 - Platform UI Layout
**Decision**: **A** — Single-page app
- Calendar view on left
- Challenge + editor on right
- Streak counter at top
- Minimal navigation = maximum focus

#### Q28 - Platform Tech Stack
**Decision**: **A** — React + Vite + Tailwind
- Same as Node.js Academy
- Reuse infrastructure
- Faster to build

#### Q29 - User Accounts & Data
**Decision**: **B** — Optional accounts
- localStorage by default (start immediately)
- Optional sign-in to sync across devices
- Reduces friction

#### Q30 - Deployment
**Decision**: **A** — Vercel
- Free tier
- Automatic deploys from GitHub
- Fast global CDN
- Supports serverless functions for future accounts

#### Q31 - Mobile Responsiveness
**Decision**: **D** — Mobile-friendly
- Responsive layout for viewing
- Editor is desktop-only (coding on mobile is painful)
- Check streak on mobile, code on desktop

#### Q32 - Accessibility
**Decision**: **A** — WCAG 2.1 AA
- Industry standard
- Shows we care about all developers
- Build it in from the start

#### Q33 - Performance Requirements
**Decision**: **B** — <500ms for all interactions
- Fast enough to feel instant
- Achievable without over-engineering
- Developers expect speed

---

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **Routing**: React Router (HashRouter for static hosting)
- **State Management**: React hooks + localStorage

### Backend (Future)
- **Platform**: Vercel serverless functions
- **Database**: PostgreSQL (for user accounts)
- **Auth**: Optional (email/password or OAuth)

### Code Execution
- **Environment**: In-browser (Web Worker sandbox)
- **Simulated Modules**: Express, PostgreSQL, JWT, bcrypt, Zod
- **Validation**: Simulated HTTP requests against user's route

---

## 📊 User Flow

### Day 1 (First Visit)
1. Land on home page
2. See "Day 1 Challenge" card
3. Click to start
4. See minimal spec: "Create POST /users that creates a new user"
5. See blank editor
6. Write code (schema + route + validation + error handling)
7. Click "Submit"
8. See detailed validation: "We sent POST /users with {name: 'Alice', email: 'alice@test.com'}, you returned 201 with {id: 1, name: 'Alice', email: 'alice@test.com'} ✓"
9. Earn "First Route" badge
10. Streak: 1 day

### Day 2 (Return Visit)
1. Land on home page
2. See streak: "1 day 🔥"
3. See "Day 2 Challenge" unlocked
4. Click to start
5. See spec: "Create GET /users/:id that returns user by ID"
6. Write code
7. Submit
8. See validation (pass or fail with detailed feedback)
9. If fail: try again (attempt 1 of 3)
10. If fail again: try again (attempt 2 of 3)
11. If fail third time: see solution
12. Streak: 2 days

### Day 30 (Completion)
1. Complete final challenge
2. See "Blog Platform Complete" achievement
3. See all badges earned
4. See calendar view with 30 green squares
5. Streak: 30 days 🔥

---

## 🎨 UI Components

### Home Page
- **Header**: Logo, streak counter, badges preview
- **Calendar View**: 30-day grid showing completed/pending/locked challenges
- **Today's Challenge**: Large card with challenge spec
- **Recent Activity**: Last 5 completed challenges

### Challenge Page
- **Header**: Day number, challenge type (A/B/C), streak
- **Spec Panel**: Minimal spec on left
- **Editor Panel**: Monaco editor on right
- **Validation Panel**: Bottom panel showing test results
- **Action Buttons**: Run, Submit, Show Solution (after 3 fails)

### Profile Page (Future)
- **Streak Calendar**: GitHub-style contribution graph
- **Badges**: All earned badges
- **Challenge History**: List of all completed challenges
- **Stats**: Total routes built, accuracy rate, fastest completion

---

## 📝 Challenge Structure

Each challenge includes:
```typescript
{
  day: number,
  type: 'A' | 'B' | 'C',
  spec: string, // "Create POST /users that creates a new user"
  testCases: [
    {
      request: { method: 'POST', path: '/users', body: { name: 'Alice', email: 'alice@test.com' } },
      expectedStatus: 201,
      expectedBody: { id: 1, name: 'Alice', email: 'alice@test.com' }
    },
    // ... 2-4 more test cases
  ],
  solution: string, // Complete working code
  explanation: string // Educational explanation
}
```

---

## 🏆 Badge System

### Streak Badges
- **7-Day Streak**: "Week Warrior" 🔥
- **30-Day Streak**: "Monthly Master" 🔥🔥
- **100-Day Streak**: "Century Coder" 🔥🔥🔥

### Skill Badges
- **CRUD Master**: Complete all CRUD challenges
- **Validation Expert**: Complete all validation challenges
- **Error Handling Pro**: Complete all error handling challenges
- **Query Queen/King**: Complete all database query challenges

### Achievement Badges
- **First Route**: Complete Day 1
- **10 Routes**: Complete 10 challenges
- **Blog Platform Complete**: Complete all 30 challenges
- **Perfect Day**: Complete a challenge without any failed attempts

---

## 🚀 Implementation Plan

### Phase 1: Core Platform (Week 1)
- [ ] Set up React + Vite + Tailwind project
- [ ] Build home page with calendar view
- [ ] Build challenge page with Monaco editor
- [ ] Implement code execution (reuse from Node.js Academy)
- [ ] Implement validation system (simulated HTTP requests)
- [ ] Implement streak tracking (localStorage)

### Phase 2: Content (Week 2)
- [ ] Create 30 challenge specs
- [ ] Create test cases for each challenge
- [ ] Create solutions for each challenge
- [ ] Create educational explanations

### Phase 3: Motivation (Week 3)
- [ ] Implement badge system
- [ ] Implement streak calendar
- [ ] Implement challenge review
- [ ] Add animations and polish

### Phase 4: Launch (Week 4)
- [ ] Deploy to Vercel
- [ ] Test on multiple browsers
- [ ] Gather feedback
- [ ] Iterate based on feedback

---

## 📈 Success Metrics

- **Completion Rate**: % of users who complete all 30 challenges
- **Daily Active Users**: % of users who return daily
- **Average Streak Length**: How long users maintain streaks
- **Solution Reveal Rate**: % of users who need to see the solution
- **Time to Completion**: Average time to complete each challenge

---

## 🎓 Learning Outcomes

By completing all 30 challenges, developers will be able to:
- Build production-ready Express routes with all layers (validation, error handling, database)
- Design PostgreSQL schemas for real-world applications
- Handle edge cases and errors gracefully
- Optimize queries for performance
- Build complete APIs from scratch
- Debug routes using detailed feedback
- Work under minimal specifications (real-world scenario)

---

## 🔮 Future Enhancements

- **Optional accounts**: Sync progress across devices
- **Community features**: Share solutions, discuss approaches
- **Advanced challenges**: 60-day and 90-day tracks
- **Team challenges**: Build APIs together
- **Interview prep**: Challenges based on real interview questions
- **Certification**: Get certified after completing all challenges

---

## 📚 References

- Design methodology: Matt Pocock's `/grill-me` skill
- Code execution: Reused from Node.js Academy
- Inspiration: LeetCode, Advent of Code, daily coding challenges

---

**Document Version**: 1.0  
**Last Updated**: 2026-09-17  
**Status**: ✅ Design Complete, Ready for Implementation
