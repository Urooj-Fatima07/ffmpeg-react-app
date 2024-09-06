// src/components/ExtractAudio.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';

const ExtractAudio = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [format, setFormat] = useState('mp3');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFormatChange = (event) => {
    setFormat(event.target.value);
  };

  const onUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a video file to upload.');
      return;
    }

    setLoading(true); // Start loading
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('format', format);

    try {
      const response = await axios.post('http://localhost:3001/extract-audio', formData, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `output.${format}`);
      document.body.appendChild(link);
      link.click();
      setMessage('Audio extracted and downloaded successfully.');
    } catch (error) {
      setMessage('Error extracting audio.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-aliceblue rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-[#800000] mb-4">Extract Audio from Video</h2>
      <input
        type="file"
        onChange={onFileChange}
        className="block w-full text-sm text-[#800000] border border-gray-300 rounded-md p-2 mb-4"
      />
      <select
        value={format}
        onChange={onFormatChange}
        className="block w-full text-sm text-[#800000] border-0 rounded-md p-2 mb-4"
      >
        <option className=' text-sm text-[#800000]' value="mp3">MP3</option>
        <option className=' text-sm text-[#800000]' value="aac">AAC</option>
        <option className=' text-sm text-[#800000]' value="wav">WAV</option>
      </select>
      <button
        onClick={onUpload}
        className="w-full bg-[#800000] text-white font-semibold py-2 rounded-md hover:bg-[#421414]"
      >
        Extract Audio
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

export default ExtractAudio;
