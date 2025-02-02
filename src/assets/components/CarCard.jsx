import React, { useState } from "react";

const CarCard = ({ car, onCardClick }) => {
  const [carImage, setCarImage] = useState(null);

  const API_KEY = "AIzaSyD2LJPA05jgEwLlFOD2pW2aUCOKxPqCGdo"; // Your API Key
  const SEARCH_ENGINE_ID = "20b49f23c668347ec"; // Your Search Engine ID

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
          onCardClick(car, imageUrl); // Send both car details and image URL to parent
        } else {
          onCardClick(car, "default-image-url"); // Set a default image if no search results
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
        onCardClick(car, "default-image-url"); // Use a default image on error
      }
    } else {
      onCardClick(car, carImage); // If image is already fetched, use it
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
