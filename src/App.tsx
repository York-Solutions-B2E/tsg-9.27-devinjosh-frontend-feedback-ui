import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/shared';
import { SubmitFeedback } from './components/SubmitFeedback';
import { MyFeedback } from './components/MyFeedback';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navigation />
        <main className="container mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/submit" replace />} />
            <Route path="/submit" element={<SubmitFeedback />} />
            <Route path="/my-feedback" element={<MyFeedback />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App
