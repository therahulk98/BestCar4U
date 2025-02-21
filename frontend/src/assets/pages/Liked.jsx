import React from "react";
import CarCard from "../components/CarCard";

const Liked = ({ user, favoriteCars, loadingFavorites }) => {
  return (
    <div key={user?.id} className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">Your Favorite Cars</h1>
      {loadingFavorites && favoriteCars.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {favoriteCars.length > 0 ? (
            favoriteCars.map(({ car, _id }) => (
              <CarCard key={_id || `${car.model}-${Math.random()}`} car={car} user={user} />
            ))
          ) : (
            <p>No favorite cars yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Liked;
