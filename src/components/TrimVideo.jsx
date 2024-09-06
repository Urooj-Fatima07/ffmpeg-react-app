// src/components/TrimVideo.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';

const TrimVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [startTime, setStartTime] = useState('00:00:00');
  const [endTime, setEndTime] = useState('00:00:10');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onVideoChange = (event) => {
    setSelectedVideo(event.target.files[0]);
  };

  const onStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const onEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const onUpload = async () => {
    if (!selectedVideo) {
      setMessage('Please select a video file to upload.');
      return;
    }

    if (!/^(\d{2}):(\d{2}):(\d{2})$/.test(startTime) || !/^(\d{2}):(\d{2}):(\d{2})$/.test(endTime)) {
      setMessage('Invalid time format. Use hh:mm:ss.');
      return;
    }

    setLoading(true); // Start loading
    const formData = new FormData();
    formData.append('video', selectedVideo);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);

    try {
      const response = await axios.post('http://localhost:3001/trim-video', formData, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'trimmed_output.mp4');
      document.body.appendChild(link);
      link.click();
      setMessage('Video trimmed successfully.');
    } catch (error) {
      setMessage('Error trimming video.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-aliceblue rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-[#808000] mb-4">Trim Video</h2>
      <input
        type="file"
        onChange={onVideoChange}
        className="block w-full text-sm text-[#808000] border border-gray-300 rounded-md p-2 mb-4"
      />
      <input
        type="text"
        placeholder="Start Time (hh:mm:ss)"
        value={startTime}
        onChange={onStartTimeChange}
        className="block w-full text-sm text-[#808000] border border-gray-300 rounded-md p-2 mb-4"
      />
      <input
        type="text"
        placeholder="End Time (hh:mm:ss)"
        value={endTime}
        onChange={onEndTimeChange}
        className="block w-full text-sm text-[#808000] border border-gray-300 rounded-md p-2 mb-4"
      />
      <button
        onClick={onUpload}
        className="w-full bg-[#808000] text-white font-semibold py-2 rounded-md hover:bg-[#666602]"
      >
        Trim Video
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

export default TrimVideo;
