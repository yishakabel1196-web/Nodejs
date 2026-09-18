import { HashRouter, Routes, Route, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';

function LessonPageWrapper() {
  const { lessonId } = useParams();
  return <LessonPage key={lessonId} />;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route path="/course/:courseId/lesson/:lessonId" element={<LessonPageWrapper />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
