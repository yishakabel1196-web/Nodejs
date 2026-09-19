# Node.js Academy 🚀

An interactive Node.js learning platform with a built-in code editor, structured courses, and progress tracking.

![Node.js Academy](https://img.shields.io/badge/Node.js-Learning%20Platform-green?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Monaco Editor](https://img.shields.io/badge/Monaco-Editor-purple?style=for-the-badge&logo=visual-studio-code&logoColor=white)

## ✨ Features

- **Interactive Code Editor**: Full Monaco Editor (VS Code) with syntax highlighting, autocomplete, and line numbers
- **4 Comprehensive Courses**:
  - 🟢 Node.js Basics
  - ⚡ Async Programming
  - 🚀 Express.js
  - 📁 File System
- **20 Hands-on Lessons**: Each with theory, examples, exercises, and solutions
- **Instant Code Execution**: Run JavaScript code directly in the browser
- **Progress Tracking**: localStorage-based progress persistence
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Beautiful dark theme with blue/cyan accents

## 🎯 Learning Path

### Course 1: Node.js Basics
1. Hello World
2. Variables & Types
3. Functions
4. Arrays & Objects
5. Conditionals & Loops

### Course 2: Async Programming
1. Callbacks
2. Promises
3. Async/Await
4. Event Emitter
5. Error Handling

### Course 3: Express.js
1. Introduction to Express
2. Middleware
3. Routing
4. Request & Response
5. Error Handling in Express

### Course 4: File System
1. File System Basics
2. Path Module
3. Working with Directories
4. Streams
5. Working with JSON Files

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/nodejs-academy.git
cd nodejs-academy
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

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
│   ├── components/       # Reusable components
│   ├── data/
│   │   └── courses.ts    # Course and lesson data
│   ├── hooks/
│   │   └── useProgress.ts # Progress tracking hook
│   ├── pages/
│   │   ├── HomePage.tsx      # Landing page with course cards
│   │   ├── CoursePage.tsx    # Course overview with lessons list
│   │   └── LessonPage.tsx    # Interactive lesson with editor
│   ├── utils/
│   │   └── executor.ts   # Code execution sandbox
│   ├── App.tsx           # Main app with routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 Features in Detail

### Code Execution
The platform uses a sandboxed execution environment that:
- Runs JavaScript code in the browser
- Captures console.log output
- Handles errors gracefully
- Compares output against expected results

### Progress Tracking
- Automatically saves completed lessons to localStorage
- Shows progress bars on course cards
- Displays completion status on lessons
- Persists across browser sessions

### Lesson Structure
Each lesson follows a consistent pattern:
1. **Theory** - Conceptual explanation with examples
2. **Example Code** - Working code demonstrations
3. **Exercise** - Hands-on coding challenge
4. **Solution** - Reference implementation (hidden by default)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new courses and lessons
- Improve existing content
- Fix bugs
- Enhance the UI/UX

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by interactive learning platforms like freeCodeCamp and Codecademy
- Built with modern web technologies
- Designed for developers who learn by doing

## 📧 Contact

Created with ❤️ for the Node.js community.

---

**Happy Coding!** 🎉
