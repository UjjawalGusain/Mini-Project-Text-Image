import React, { useState } from 'react';
import axios from 'axios';
import ENDPOINTS from '../../services/api';

function RemoveButton() {
  const [imageId, setImageId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResponseMessage('');
    setImageId('');
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (token && imageId) {
      try {
        const response = await axios.delete(
          `${ENDPOINTS.IMAGE.DELETE_IMAGE}${imageId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResponseMessage('Image deleted successfully!');
      } catch (error) {
        console.error('Error deleting image:', error);
        setResponseMessage('Failed to delete image. Please try again.');
      }
    } else {
      setResponseMessage('Please provide a valid image ID.');
    }
  };

  return (
    <div>
      {/* Remove Image Button */}
      <button
        onClick={openModal}
        className="fixed bottom-5 left-5 bg-red-300 text-black font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out z-50"
      >
        Remove Image
      </button>

      {/* Remove Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Delete Image</h3>
            <input
              type="text"
              placeholder="Enter Image ID"
              value={imageId}
              onChange={(e) => setImageId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-300"
            >
              Confirm Delete
            </button>
            <button
              onClick={closeModal}
              className="ml-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-all duration-300"
            >
              Cancel
            </button>
            {responseMessage && (
              <p className="mt-4 text-sm text-center text-gray-700">
                {responseMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RemoveButton;
