import React, { useEffect, useState } from "react";
import CarCard from "./assets/components/CarCard.jsx";
import { FaArrowUp  } from "react-icons/fa6";
import carData, {
  filterByBudget,
  getAllBrands,
  getAllBodyTypes,
  getAllFuelTypes,
  filterByBrand,
  filterByBodyType,
  filterByFuelType,
  getAllTransmissionTypes,
  filterByTransmissionType,
  getAllBudgetRanges,
} from "./assets/data/carData.js";

// Function to get unique cars
const getUniqueCars = (carData) => {
  const carMap = {};

  carData.forEach((car) => {
    const model = car.Model?.toString().trim(); // Ensure model is a string

    if (!model) {
      console.warn("Missing model for car:", car);
      return;
    }

    const price = car["Ex-Showroom_Price"]
      ? parseInt(car["Ex-Showroom_Price"].replace(/\D/g, ""), 10)
      : 0;

    if (!carMap[model] || price < carMap[model].price) {
      carMap[model] = {
        make: car.Make,
        model,
        price: price ? `Rs. ${price.toLocaleString()}` : "Price Not Available",
        image: car.image || "",
      };
    }
  });

  console.log("Unique cars:", carMap);
  

  return Object.values(carMap);
};


const App = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterModal, setFilterModal] = useState(false);

  const [brands, setBrands] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [transmissionTypes, setTransmissionTypes] = useState([]);
  const [budgetRanges, setBudgetRanges] = useState([]);
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    brand: "",
    bodyType: "",
    fuelType: "",
    transmission: "",
    budget: "",
  });

  const [filteredCars, setFilteredCars] = useState(carData);

  // Get unique cars by model
  const uniqueCars = getUniqueCars(filteredCars);

  // Search filter
  const filteredCarsBySearch = uniqueCars.filter((car) =>
    car.model && typeof car.model === "string"
      ? car.model.toLowerCase().includes(searchQuery.toLowerCase())
      : false
  );

  const handleScroll = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  const goUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  // Apply filters
  const handleFilter = (filterName, filterValue) => {
    console.log(`Applying filter: ${filterName} with value: ${filterValue}`);
    const newFilters = { ...filters, [filterName]: filterValue };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (filters) => {
    let updatedCars = carData;

    if (filters.brand) updatedCars = filterByBrand(updatedCars, filters.brand);
    if (filters.bodyType) updatedCars = filterByBodyType(updatedCars, filters.bodyType);
    if (filters.fuelType) updatedCars = filterByFuelType(updatedCars, filters.fuelType);
    if (filters.transmission) updatedCars = filterByTransmissionType(updatedCars, filters.transmission);

    if (filters.budget) {
      let minBudget, maxBudget;
      
      if (filters.budget === "1 Crore ++") {
        minBudget = 10000000;
        maxBudget = null;
      } else {
        [minBudget, maxBudget] = filters.budget
          .split("-")
          .map(part => parseInt(part.replace(/\D/g, ""), 10) * 100000);
      }

      updatedCars = filterByBudget(updatedCars, minBudget, maxBudget);
    }

    console.log("Updated cars after filter:", updatedCars);
    setFilteredCars(updatedCars);
  };

  // Clear filter
  const clearFilter = (filterName) => {
    const newFilters = { ...filters, [filterName]: "" };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Toggle modal
  const toggleModal = (filterName = "") => {
    setFilterModal(!filterModal);
    setSelectedFilter(filterName);
  };

  // Load filter options
  useEffect(() => {
    setBrands(getAllBrands());
    setBodyTypes(getAllBodyTypes());
    setFuelTypes(getAllFuelTypes());
    setTransmissionTypes(getAllTransmissionTypes());
    setBudgetRanges(getAllBudgetRanges());
  }, []);

  useEffect(() => {
    console.log("Filtered cars updated:", filteredCars);
  }, [filteredCars]);

  useEffect(() => {
    // Ensure the page starts from the top on refresh
    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"; // Prevents browser from restoring the previous scroll position
    }
  }, []);

  useEffect(() => {
    const handleScrollEvent = () => {
      const scrollThreshold = window.innerHeight * 0.2; // 20% of the viewport height
      setShowGoToTop(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);


  return (
    <div className="flex items-center justify-center h-full text-center bg-gradient-to-r from-purple-500 to-red-500">
      <div className="w-full min-h-screen text-center ">

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-screen ">
          
          <h1 className=" text-6xl font-bold shadow-xl">Want to Find the Best Car for You?</h1>
          <br /><br /><br /><br />
          <button className="text-xl font-bold border-2 p-4 rounded-full border-white shadow-xl hover:bg-black hover:text-yellow-500" onClick={handleScroll}>Let's begin</button>
        </div>

        

        <div className="flex min-h-screen ">
          {/* Left Sidebar */}
          <div className="w-1/6 bg-violet-600 p-5 h-full">
            
            {/* Filter Section */}
            <h3 className="font-bold text-4xl pt-5 bg-violet-800 text-white shadow-xl">Filter</h3>
            <input
              type="text"
              placeholder="Search cars..."
              className="w-full p-2 mt-4 rounded border bg-violet-300 border-white text-black shadow-xl text-xl placeholder:text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="font-semibold text-md bg-violet-500   p-4 shadow-xl">
              <ul className="space-y-2 cursor-pointer text-white ">
                <li className="hover:text-yellow-400" onClick={() => toggleModal("budget")}>Budget</li>
                <li className="hover:text-yellow-400" onClick={() => toggleModal("brand")}>Brand</li>
                <li className="hover:text-yellow-400" onClick={() => toggleModal("bodyType")}>Body Type</li>
                <li className="hover:text-yellow-400" onClick={() => toggleModal("fuelType")}>Fuel Type</li>
                <li className="hover:text-yellow-400" onClick={() => toggleModal("transmission")}>Transmission</li>
              </ul>
              <button className="border-2 border-black px-2 mt-4 rounded-lg hover:bg-black hover:text-white" onClick={() => (setFilteredCars(carData), setFilterModal(false), setFilters({ brand: "", bodyType: "", fuelType: "", transmission: "", budget: "" })) }>
                Clear
              </button>
            </div>

            {/* Go to top Button */}
            
            {showGoToTop && (
              <button className="fixed bottom-8 right-8 bg-gray-500 text-white p-4 rounded-full shadow-lg hover:bg-black transition-all" onClick={goUp}> <FaArrowUp /> </button>
            )}

            {/* Filter Modal */}
            {filterModal && (
              <div className="absolute left-[230px] top-[800px] min-w-[500px] max-w-[600px] border-4 border-blue-400 bg-blue-200 rounded-2xl overflow-y-auto p-2 shadow-lg ">
                <div className="p-2 font-semibold">
                  <div className="absolute top-2 right-4 cursor-pointer font-bold text-xl" onClick={() => toggleModal()}>
                    X
                  </div>
                  <h1 className="text-2xl font-bold">{selectedFilter.toUpperCase()}</h1>
                  <br />

                  

                  {/* Filter Options */}
                  <ul className="grid grid-cols-4 gap-2">
                    {(selectedFilter === "budget" ? budgetRanges : 
                      selectedFilter === "brand" ? brands :
                      selectedFilter === "bodyType" ? bodyTypes :
                      selectedFilter === "fuelType" ? fuelTypes :
                      selectedFilter === "transmission" ? transmissionTypes : []
                    ).map((option, index) => (
                      <button key={index} className="border-2 border-black px-2 py-1 rounded-full" onClick={() => (handleFilter(selectedFilter, option), setFilterModal(false))}>
                        {option}
                      </button>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          

          {/* Right Side */}
          <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-r from-purple-500 to-red-500 ">
          {/* Selected Filters */}
            <div className="flex flex-wrap justify-start w-full p-4 gap-5">
          {Object.entries(filters)
                    .filter(([key, value]) => value)
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center bg-violet-500 text-white p-2 my-2 rounded-full w-fit gap-5 font-semibold h-10 border-2 border-gray-300 ">
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                        <button className="ml-2 text-black font-extrabold text-2xl " onClick={() => clearFilter(key)}>
                          X
                        </button>
                      </div>
                    ))}
            </div>



            <div className="flex flex-wrap gap-4 justify-center ">
              {filteredCarsBySearch.length > 0 ? (
                filteredCarsBySearch.map((car, index) => (
                  <CarCard  key={index} make={car.make} model={car.model} price={car.price} image={car.image} />
                ))
              ) : (
                <p>No cars match the selected filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
