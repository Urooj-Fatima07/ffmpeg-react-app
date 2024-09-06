import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ConvertVideo from './components/ConvertVideo';
import ExtractAudio from './components/ExtractAudio';
import CompressVideo from './components/CompressVideo';
import MergeVideoAudio from './components/MergeVideoAudio';
import TrimVideo from './components/TrimVideo';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
        <nav
          className="p-4 shadow-md"
          style={{
            background: 'linear-gradient(to right, rgba(128, 0, 0, 0.5), rgba(0, 128, 128, 0.5), rgba(232, 2, 94, 0.5), rgba(128, 128, 0, 0.5), rgba(146, 47, 146, 0.5))',
          }}
        >
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">FFmpeg App</h1>
            <ul className="flex space-x-4">
              <li>
                <Link to="/convert-video" className="text-white hover:text-blue-200">Convert Video</Link>
              </li>
              <li>
                <Link to="/extract-audio" className="text-white hover:text-blue-200">Extract Audio</Link>
              </li>
              <li>
                <Link to="/compress-video" className="text-white hover:text-blue-200">Compress Video</Link>
              </li>
              <li>
                <Link to="/merge-video-audio" className="text-white hover:text-blue-200">Merge Video and Audio</Link>
              </li>
              <li>
                <Link to="/trim-video" className="text-white hover:text-blue-200">Trim Video</Link>
              </li>
            </ul>
          </div>
        </nav>


        <main className="flex-1 container mx-auto p-6 rounded-lg shadow-lg">
          <Routes>
            <Route path="/convert-video" element={<ConvertVideo />} />
            <Route path="/extract-audio" element={<ExtractAudio />} />
            <Route path="/compress-video" element={<CompressVideo />} />
            <Route path="/merge-video-audio" element={<MergeVideoAudio />} />
            <Route path="/trim-video" element={<TrimVideo />} />
            <Route path="/" element={
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Welcome to the FFmpeg Multimedia Processing App</h2>
                <p className="text-lg text-white">Select an operation from the menu to get started.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
