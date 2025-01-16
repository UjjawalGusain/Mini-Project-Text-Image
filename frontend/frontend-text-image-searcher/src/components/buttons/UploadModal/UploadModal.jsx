import React, { useState } from 'react';
import axios from 'axios';
import ENDPOINTS from '../../../services/api';

function UploadModal({ isOpen, onClose, userId }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    const handleUpload = async () => {
      if (!selectedFile) {
        setError('Please select a file to upload.');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userid', userId);
  
      try {
        setIsUploading(true);
        setError('');
  
        const response = await axios.post(
          ENDPOINTS.IMAGE.UPLOAD_IMAGE,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        alert('Image uploaded successfully!');
        onClose(); 
  
      } catch (error) {
        setError('Error uploading image. Please try again.');
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false);
      }
    };
  
    return (
      <>


        {/* Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 backdrop-blur-md">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <h2 className="text-lg font-bold mb-4">Upload Image</h2>
              


              {/* File input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="mb-4 w-full"
              />
              


              {/* Upload button */}
              <button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                className="bg-green-300 text-black font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </button>



              {/* Error message */}
              {error && <p className="text-red-500 mt-2">{error}</p>}
  


              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                X
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

export default UploadModal;