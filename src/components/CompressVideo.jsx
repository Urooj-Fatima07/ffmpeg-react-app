// src/components/CompressVideo.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';

const CompressVideo = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [bitrate, setBitrate] = useState('1M');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onBitrateChange = (event) => {
    setBitrate(event.target.value);
  };

  const onUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a video file to upload.');
      return;
    }

    if (!bitrate.match(/^\d+[kKmM]?$/)) {
      setMessage('Invalid bitrate format. Use something like "1M" or "500K".');
      return;
    }

    setLoading(true); // Start loading
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('bitrate', bitrate);

    try {
      const response = await axios.post('http://localhost:3001/compress-video', formData, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'compressed_output.mp4');
      document.body.appendChild(link);
      link.click();
      setMessage('Video compressed and downloaded successfully.');
    } catch (error) {
      setMessage('Error compressing video.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-aliceblue rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-[#e8025e] mb-4">Compress Video</h2>
      <input
        type="file"
        onChange={onFileChange}
        className="block w-full text-sm text-[#e8025e] border border-gray-300 rounded-md p-2 mb-4"
      />
      <div className="mb-6">
        <label htmlFor="bitrate" className="block text-sm font-medium text-[#e8025e] mb-2">
          Bitrate (e.g., 100K)
        </label>
        <input
          id="bitrate"
          type="text"
          placeholder="Bitrate (e.g., 100K)"
          value={bitrate}
          onChange={onBitrateChange}
          className="block w-full text-sm text-[#e8025e] border-0 rounded-md p-2 mb-2"
        />
        <p className="text-xs text-[#e8025e]">
          Enter the desired bitrate for video compression. You can use values only in "k" units like "500K" or "2000k".
        </p>
      </div>

      <button
        onClick={onUpload}
        className="w-full bg-[#e8025e] text-white font-semibold py-2 rounded-md hover:bg-[#d20155]"
      >
        Compress Video
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

export default CompressVideo;
