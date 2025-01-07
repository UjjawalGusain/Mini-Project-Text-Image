import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ENDPOINTS from "../../services/api";

function SearchBar({ placeholder = "Search something...", topK = 3 }) {
  const [searchText, setSearchText] = useState("");
  const [embedding, setEmbedding] = useState(null);
  const [imageResults, setImageResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const usernameFromToken = decodedToken.username;
          
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

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    if (e.key === "Enter" && searchText.trim()) {
      setIsLoading(true);
      setError(null);
      setImageResults([]); 

      try {
        const embeddingResponse = await axios.post(
          ENDPOINTS.EMBEDDING.TEXT_EMBEDDING,
          { text: searchText },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const textEmbedding = embeddingResponse.data.embedding;
        setEmbedding(textEmbedding);

        const imageResponse = await axios.post(
          ENDPOINTS.DB.QUERY_IMAGE_EMBEDDING,
          {
            user_id: userId,
            query_embeddings: textEmbedding,
            top_k: topK,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        const imageIds = imageResponse.data.results.ids[0];
        
        const imageUrlsResponse = await axios.post(
          ENDPOINTS.IMAGE.GET_IMAGES_BY_ID,
          {
            user_id: userId,
            image_ids: imageIds,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(imageUrlsResponse);
        
        
        setImageResults(imageUrlsResponse.data.images);
      } catch (err) {
        setError("Error fetching data. Please try again.");
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center w-full h-14 rounded-lg shadow-xl bg-white border-2 border-gray-300">
        <div className="flex justify-center items-center h-full w-16 text-gray-700 text-2xl">
          <CiSearch />
        </div>
        <input
          className="peer h-full w-full outline-none text-sm text-gray-800 placeholder-gray-500 pl-4 pr-2 rounded-md focus:ring-2 focus:ring-blue-400"
          type="text"
          id="search"
          placeholder={placeholder}
          value={searchText}
          onChange={handleSearchChange}
          onKeyDown={handleSearchSubmit}
        />
      </div>

      {/* Loading/Error messages */}
      {isLoading && <p className="text-gray-500 mt-2">Loading results...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Display Image Results */}
      {imageResults.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-gray-700">Closest Images:</h4>
          <ul className="flex gap-4 mt-4 overflow-x-auto">
            {imageResults.map((result, index) => (
              <li key={index} className="flex-shrink-0">
                <img
                  src={result.url}
                  alt={`Image ${index + 1}`}
                  className="w-40 h-40 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
