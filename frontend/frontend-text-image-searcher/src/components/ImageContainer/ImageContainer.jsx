import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "./Image/Image";
import { jwtDecode } from "jwt-decode";
import ENDPOINTS from "../../services/api";

function ImageContainer() {
  const [images, setImages] = useState([]); // Array of { id, url }
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const usernameFromToken = decodedToken.username;
          setUsername(usernameFromToken);

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

  useEffect(() => {
    const fetchImages = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `${ENDPOINTS.IMAGE.GET_IMAGES}${userId}`
          );
          
          const fetchedImages = response.data.images.map((image) => ({
            id: image.id, // Include image ID
            url: image.url, // Include image URL
          }));
        
          
          setImages(fetchedImages);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      }
    };

    if (userId) {
      fetchImages();
    }
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map(({ id, url }, index) => (
          <div key={index} className="text-center">
            <Image src={url} alt={`Image ${index + 1}`} />
            <p className="mt-2 text-sm text-gray-600">ID: {id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageContainer;
