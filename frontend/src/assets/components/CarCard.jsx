import React, { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { AiFillHeart } from "react-icons/ai";
import { ImBin2 } from "react-icons/im";
import axios from "axios";

const CarCard = ({ car, onCardClick, user, favoriteCars, API_BASE_URL, isLikedPage }) => {
  const [carImage, setCarImage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (favoriteCars && user) {
      setIsFavorite(favoriteCars.some(fav => fav.model === car.model));
    }
  }, [favoriteCars, user, car.model]);

  const handleCarClick = async () => {
    if (!carImage) {
      const query = `${car.make} ${car.model} car`;
      const searchURL = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${import.meta.env.VITE_REACT_APP_SEARCH_ENGINE_ID}&key=${import.meta.env.VITE_REACT_APP_API_KEY}&searchType=image`;

      try {
        const response = await fetch(searchURL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          setCarImage(data.items[0].link);
          onCardClick(car, data.items[0].link);
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

  const addToFavorites = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("You need to log in to favorite a car!");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/favorites/add`, {
        car: { make: car.make, model: car.model, price: car.price },
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setIsFavorite(true);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const removeFromFavorites = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("You need to log in to remove a favorite!");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/favorites/remove`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { model: car.model },
      });

      setIsFavorite(false);
    } catch (error) {
      console.error("Error removing from favorites:", error);
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

      {/* Heart Icon (Favorite) */}
      <div className="absolute top-1 right-0 text-xl cursor-pointer">
        {isFavorite ? (
          <AiFillHeart className="text-red-500 hover:scale-125 transition" />
        ) : (
          <CiHeart
            className="text-white hover:scale-125 transition"
            onClick={addToFavorites}
          />
        )}
      </div>

      {/* Delete Icon (Only on Liked Page) */}
      {isLikedPage && (
        <div className="absolute top-16 right-0 text-md cursor-pointer">
          <ImBin2
            className="text-red-600 hover:scale-150 transition"
            onClick={removeFromFavorites}
          />
        </div>
      )}
    </div>
  );
};

export default CarCard;
