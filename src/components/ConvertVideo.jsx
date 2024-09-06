// src/components/ConvertVideo.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';

const ConvertVideo = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [format, setFormat] = useState('avi');
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
      setMessage('Please select a file to upload.');
      return;
    }

    setLoading(true); // Start loading
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('format', format);

    try {
      const response = await axios.post('http://localhost:3001/convert', formData, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `output.${format}`);
      document.body.appendChild(link);
      link.click();
      setMessage('File converted and downloaded successfully.');
    } catch (error) {
      setMessage('Error in file conversion.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-aliceblue rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-[#008080] mb-4">Convert Video</h2>
      <input
        type="file"
        onChange={onFileChange}
        className="block w-full text-sm text-[#008080] border border-gray-300 rounded-md p-2 mb-4"
      />
      <select
        value={format}
        onChange={onFormatChange}
        className="block w-full text-sm text-[#008080] border border-gray-300 rounded-md p-2 mb-4"
      >
        <option value="avi">AVI</option>
        <option value="mkv">MKV</option>
        <option value="mp4">MP4</option>
      </select>
      <button
        onClick={onUpload}
        className="w-full bg-[#008080] text-white font-semibold py-2 rounded-md hover:bg-[#265f5f]"
      >
        Convert
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

export default ConvertVideo;
