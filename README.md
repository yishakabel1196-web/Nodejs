# Node.js Academy 🚀

An interactive Node.js learning platform with a built-in code editor, structured courses, multi-file IDE, and progress tracking.

![Node.js Academy](https://img.shields.io/badge/Node.js-Learning%20Platform-green?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Monaco Editor](https://img.shields.io/badge/Monaco-Editor-purple?style=for-the-badge&logo=visual-studio-code&logoColor=white)

## ✨ Features

- **Full IDE Experience**: Monaco Editor (VS Code) with file tree, tabs, create/delete files
- **9 Comprehensive Courses** covering the full backend development stack
- **45+ Hands-on Lessons** with theory, examples, exercises, and solutions
- **Enhanced Code Execution**: Simulates Express, PostgreSQL, JWT, bcrypt, Zod validation
- **Progress Tracking**: localStorage-based progress persistence
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Beautiful dark theme with blue/cyan accents

## 📚 Courses

### Core Fundamentals
1. 🟢 **Node.js Basics** - Variables, functions, arrays, objects, control flow
2. ⚡ **Async Programming** - Callbacks, promises, async/await, event emitters
3. 🚀 **Express.js** - Routing, middleware, request/response, error handling
4. 📁 **File System** - fs module, path, directories, streams, JSON files

### Advanced Backend
5. 🌐 **REST API Design** - REST principles, validation, error handling, pagination, versioning
6. 🗄️ **PostgreSQL & SQL** - Queries, node-postgres, schema design, transactions, optimization
7. 🔐 **Authentication & Security** - JWT, bcrypt, auth middleware, login/register, security
8. 🧪 **Testing Node.js** - Unit tests, async testing, integration tests, coverage, CI
9. 🛡️ **Validation & Error Handling** - Input validation, custom errors, middleware, logging, health checks

## 🎯 Learning Path

Each lesson follows a consistent pattern:
1. **Theory** - Conceptual explanation with examples
2. **Example Code** - Working code demonstrations
3. **Exercise** - Hands-on coding challenge
4. **Solution** - Reference implementation (hidden by default)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/nodejs-academy.git
cd nodejs-academy
npm install
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editor (VS Code's editor)
- **React Router** - Client-side routing

## 📁 Project Structure

```
nodejs-academy/
├── src/
│   ├── components/
│   │   └── FileTree.tsx       # File explorer with tabs
│   ├── data/
│   │   ├── courses.ts         # Core course data
│   │   ├── advancedCourses.ts # REST API + PostgreSQL courses
│   │   └── moreCourses.ts     # Auth + Testing + Validation courses
│   ├── hooks/
│   │   └── useProgress.ts     # Progress tracking hook
│   ├── pages/
│   │   ├── HomePage.tsx       # Landing page with course cards
│   │   ├── CoursePage.tsx     # Course overview with lessons list
│   │   └── LessonPage.tsx     # Interactive lesson with IDE
│   ├── utils/
│   │   └── executor.ts        # Code execution with simulated modules
│   ├── App.tsx                # Main app with routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── package.json
└── README.md
```

## 🎮 IDE Features

### File Explorer
- Browse project files in a tree structure
- Create new files and folders
- Delete files with right-click context menu
- Different project structures per course type

### Multi-File Editing
- Tabbed interface for open files
- Switch between files easily
- Each lesson has a realistic project structure

### Enhanced Execution
The platform simulates real Node.js modules:
- **Express** - Routes, middleware, request/response
- **PostgreSQL (pg)** - Queries, connection pools
- **jsonwebtoken** - Sign and verify JWTs
- **bcrypt** - Hash and compare passwords
- **Zod** - Schema validation
- **Joi** - Input validation

## 🏗️ Architecture

### Phase 1 (Current)
- ✅ Browser-based learning platform
- ✅ 9 courses with 45+ lessons
- ✅ Monaco Editor with file tree
- ✅ Simulated backend execution

### Phase 2 (Planned)
- 🔄 Real backend execution with Docker
- 🔄 PostgreSQL database integration
- 🔄 Cloud-hosted execution environment
- 🔄 User accounts and cloud progress sync

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new courses and lessons
- Improve existing content
- Fix bugs
- Enhance the UI/UX

## 📝 License

MIT License

## 🙏 Acknowledgments

- Inspired by interactive learning platforms like freeCodeCamp and Codecademy
- Skills methodology from [mattpocock/skills](https://github.com/mattpocock/skills)
- Built with modern web technologies

---

**Happy Coding!** 🎉
