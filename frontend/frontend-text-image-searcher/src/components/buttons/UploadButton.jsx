import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import UploadModal from './UploadModal/UploadModal';
import ENDPOINTS from '../../services/api';

function UploadButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Decode the token to extract the username
          const decodedToken = jwtDecode(token);
          const usernameFromToken = decodedToken.username;  // Extract username from the token
          
          // Fetch userId based on the username
          const response = await axios.get(
            `${ENDPOINTS.USER.GET_USER_ID}${usernameFromToken}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const fetchedUserId = response.data.userid;
          setUserId(fetchedUserId);
        } catch (error) {
          console.error("Error fetching userId:", error);
        }
      }
    };

    fetchUserId();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Upload Image Button */}
      <button
        onClick={openModal}
        className="fixed bottom-5 right-5 bg-green-300 text-black font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out z-50"
      >
        Upload Image
      </button>

      {/* Upload Modal */}
      {userId && (
        <UploadModal isOpen={isModalOpen} onClose={closeModal} userId={userId} />
      )}
    </div>
  );
}

export default UploadButton;
