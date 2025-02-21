import React, { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";

const CarCard = ({ car, onCardClick, user, favoriteCars }) => {
  const [carImage, setCarImage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
  const SEARCH_ENGINE_ID = import.meta.env.VITE_REACT_APP_SEARCH_ENGINE_ID;

  // ✅ Check if the car is in favoriteCars
  useEffect(() => {
    if (favoriteCars && user) {
      setIsFavorite(favoriteCars.some(fav => fav.model === car.model));
    }
  }, [favoriteCars, user, car.model]);

  // ✅ Fetch car image from Google API
  const handleCarClick = async () => {
    if (!carImage) {
      const query = `${car.make} ${car.model} car`;
      const searchURL = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${SEARCH_ENGINE_ID}&key=${API_KEY}&searchType=image`;

      try {
        const response = await fetch(searchURL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const imageUrl = data.items[0].link;
          setCarImage(imageUrl);
          onCardClick(car, imageUrl);
        } else {
          onCardClick(car, "default-image-url");
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
        onCardClick(car, "default-image-url");
      }
    } else {
      onCardClick(car, carImage);
    }
  };

  // ✅ Toggle favorite (Add/Remove from Database)
  const toggleFavorite = async (e) => {
    e.stopPropagation(); // Prevent triggering `handleCarClick`

    if (!user) {
      alert("You need to log in to favorite a car!");
      return;
    }

    try {
      const requestData = { car: { make: car.make, model: car.model, price: car.price } };

      if (isFavorite) {
        // Remove from favorites
        await axios.delete("http://localhost:5000/api/favorites/remove", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: { model: car.model }
        });
        setIsFavorite(false);
      } else {
        // Add to favorites
        await axios.post("http://localhost:5000/api/favorites/add", { 
          car: { make: car.make, model: car.model, price: car.price }
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  return (
    <div
      className="border-black w-[380px] h-[140px] hover:scale-105 transform ease-in-out duration-300 cursor-pointer relative"
      onClick={handleCarClick}
    >
      <div className="border-2 border-black flex justify-between p-3 rounded-lg bg-gray-800 text-white">
        <div className="flex flex-col items-start justify-center">
          <p className="text-gray-300">{car.make}</p>
          <h1 className="text-2xl font-semibold">{car.model}</h1>
        </div>
        <div className="flex flex-col items-end justify-center pr-1">
          <h1 className="text-xl font-semibold">{car.price}</h1>
          <p className="text-white text-sm">onwards</p>
        </div>
      </div>

      {/* ✅ Favorite Heart Icon */}
      <div className="absolute top-0 right-0 text-xl cursor-pointer">
        {isFavorite ? (
          <AiFillHeart className="text-red-500 hover:scale-125 transition"
            onClick={toggleFavorite} />
        ) : (
          <CiHeart className="text-white hover:scale-125 transition"
            onClick={toggleFavorite} />
        )}
      </div>
    </div>
  );
};

export default CarCard;
