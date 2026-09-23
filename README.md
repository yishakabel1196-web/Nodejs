# Daily Routes 🚀

**One Route Per Day. 30 Days. Complete Blog Platform.**

A hardcore Node.js learning platform where developers sharpen their skills by building one backend API route per day. No hand-holding. Real-world complexity from Day 1.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Challenges](https://img.shields.io/badge/challenges-30-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Philosophy

- **No hand-holding** — minimal specs, design your own schema
- **Full complexity from Day 1** — every route includes validation, error handling, database queries
- **Fast feedback loop** — detailed request/response validation shows exactly what went wrong
- **Struggle before solution** — 3 failed attempts before showing the answer
- **Real project context** — building a blog platform across 30 days

## ✨ Features

### Core Mechanics
- **30 daily challenges** building a blog platform (users, posts, comments, likes)
- **All layers from Day 1**: route handler + validation + error handling + database + business logic
- **Minimal specs**: "Build GET /users/:id that returns user from DB"
- **Always design schema**: you design the database schema + write the route
- **Completely blank starter code**: no boilerplate, write everything
- **Detailed validation**: show exact request/response + educational explanations
- **3-5 test cases**: happy path + edge cases
- **Solution after 3 failed attempts**: struggle before seeing the answer

### Progression & Motivation
- **Difficulty increases via performance/optimization**: Day 1 = basic CRUD, Day 30 = indexes, pagination, caching
- **Calendar-day streaks**: consecutive days = streak, miss a day = reset
- **Midnight local unlock**: respects user's timezone
- **All badge types**: streak badges (7/30/100 days), skill badges (CRUD Master, Validation Expert), achievement badges (First Route, Blog Platform Complete)
- **Review allowed**: can revisit past challenges for learning, but can't re-earn streak credit

### Challenge Types (Mixed Across 30 Days)
- **Type A**: Write this route (given spec)
- **Type B**: Debug this broken route
- **Type C**: Design schema + route + validation together

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor (VS Code)
- **Routing**: React Router (HashRouter)
- **State Management**: React hooks + localStorage
- **Code Execution**: In-browser Web Worker sandbox
- **Validation**: Simulated HTTP requests

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd daily-routes

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📊 Challenge Structure

### Days 1-5: Basic CRUD (Users)
- Day 1: Create User (POST /users)
- Day 2: Get User by ID (GET /users/:id)
- Day 3: Get All Users (GET /users)
- Day 4: Update User (PUT /users/:id)
- Day 5: Delete User (DELETE /users/:id)

### Days 6-10: Posts
- Day 6: Create Post (POST /posts)
- Day 7: Get Posts by Author (GET /users/:userId/posts)
- Day 8: Create Comment (POST /posts/:postId/comments)
- Day 9: Get Comments for Post (GET /posts/:postId/comments)
- Day 10: Like Post (POST /posts/:postId/likes)

### Days 11-30: Advanced Features
- Validation challenges
- Error handling scenarios
- Performance optimization
- Complex relationships
- Edge cases

## 🏆 Badge System

### Streak Badges
- 🔥 **Week Warrior**: Maintain a 7-day streak
- 🔥🔥 **Monthly Master**: Maintain a 30-day streak
- 🔥🔥🔥 **Century Coder**: Maintain a 100-day streak

### Skill Badges
- 💪 **CRUD Master**: Complete all CRUD challenges (Days 1-5)
- ✓ **Validation Expert**: Complete validation challenges (Days 11-15)
- 🛡️ **Error Handling Pro**: Complete error handling challenges (Days 16-20)

### Achievement Badges
- 🎯 **First Route**: Complete your first challenge
- 🎯🎯 **10 Routes**: Complete 10 challenges
- 🏆 **Blog Platform Complete**: Complete all 30 challenges

## 📁 Project Structure

```
daily-routes/
├── src/
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   ├── pages/
│   │   ├── HomePage.tsx        # Home with calendar + streak
│   │   └── ChallengePage.tsx   # Challenge editor + validation
│   ├── data/
│   │   ├── types.ts            # TypeScript types
│   │   └── challenges.ts       # 30 challenge definitions
│   ├── hooks/
│   │   ├── useStreak.ts        # Streak tracking
│   │   └── useBadges.ts        # Badge system
│   └── utils/
│       ├── executor.ts         # Code execution sandbox
│       └── validator.ts        # HTTP request simulation
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
├── tailwind.config.js
└── DESIGN.md                   # Complete design document
```

## 🎓 Learning Outcomes

By completing all 30 challenges, developers will be able to:
- Build production-ready Express routes with all layers (validation, error handling, database)
- Design PostgreSQL schemas for real-world applications
- Handle edge cases and errors gracefully
- Optimize queries for performance
- Build complete APIs from scratch
- Debug routes using detailed feedback
- Work under minimal specifications (real-world scenario)

## 🔮 Future Enhancements

- [ ] Optional accounts: Sync progress across devices
- [ ] Community features: Share solutions, discuss approaches
- [ ] Advanced challenges: 60-day and 90-day tracks
- [ ] Team challenges: Build APIs together
- [ ] Interview prep: Challenges based on real interview questions
- [ ] Certification: Get certified after completing all challenges

## 📚 Design Methodology

This project was designed using Matt Pocock's `/grill-me` skill, a relentless interview process that stress-tests every design decision. The complete design document is available in [DESIGN.md](./DESIGN.md).

## 🤝 Contributing

Contributions are welcome! Areas for contribution:
- Add more challenges (Days 11-30)
- Improve validation system
- Add community features
- Enhance UI/UX
- Write documentation

## 📝 License

MIT License - feel free to use this for your own learning platform!

## 🙏 Acknowledgments

- Design methodology: Matt Pocock's `/grill-me` skill
- Code execution: Inspired by Node.js Academy
- Inspiration: LeetCode, Advent of Code, daily coding challenges

---

**Built with ❤️ for developers who learn by doing.**

**Start your 30-day journey today!** 🚀
