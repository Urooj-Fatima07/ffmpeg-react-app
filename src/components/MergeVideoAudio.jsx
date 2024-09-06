// src/components/MergeVideoAudio.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';

const MergeVideoAudio = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onVideoChange = (event) => {
    setSelectedVideo(event.target.files[0]);
  };

  const onAudioChange = (event) => {
    setSelectedAudio(event.target.files[0]);
  };

  const onUpload = async () => {
    if (!selectedVideo || !selectedAudio) {
      setMessage('Please select both video and audio files.');
      return;
    }

    setLoading(true); // Start loading
    const formData = new FormData();
    formData.append('video', selectedVideo);
    formData.append('audio', selectedAudio);

    try {
      const response = await axios.post('http://localhost:3001/merge-video-audio', formData, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'merged_output.mp4');
      document.body.appendChild(link);
      link.click();
      setMessage('Video and audio merged successfully.');
    } catch (error) {
      setMessage('Error merging video and audio.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-aliceblue rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-[#922f92] mb-4">Merge Video and Audio</h2>
      <input
        type="file"
        onChange={onVideoChange}
        className="block w-full text-sm text-[#922f92] border border-gray-300 rounded-md p-2 mb-4"
        accept="video/*"
      />
      <input
        type="file"
        onChange={onAudioChange}
        className="block w-full text-sm text-[#922f92] border border-gray-300 rounded-md p-2 mb-4"
        accept="audio/*"
      />
      <button
        onClick={onUpload}
        className="w-full bg-[#922f92] text-white font-semibold py-2 rounded-md hover:bg-[#722172]"
      >
        Merge Video and Audio
      </button>
      {loading && <Spinner />} {/* Show spinner when loading */}
      {message && (
        <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default MergeVideoAudio;
