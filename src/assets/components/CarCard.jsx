import React, { useState } from "react";



const CarCard = ({ car, onCardClick }) => {
  const [carImage, setCarImage] = useState(null);

  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
  const SEARCH_ENGINE_ID = import.meta.env.VITE_REACT_APP_SEARCH_ENGINE_ID;
  console.log("API Key:", API_KEY);
  console.log("Search Engine ID:", SEARCH_ENGINE_ID);
  console.log(import.meta.env);

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
  

  return (
    <div
      className="border-black w-[380px] h-[140px] hover:scale-105 transform ease-in-out duration-300 cursor-pointer"
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
    </div>
  );
};

export default CarCard;
