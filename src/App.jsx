// App.jsx
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import propertiesData from "./data/properties.json";
import SearchPage from "./components/SearchPage";
import PropertyPage from "./components/PropertyPage";
import "./App.css";

function App() {
  const [favourites, setFavourites] = useState([]);

  // Load favourites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("favourites");
    if (saved) {
      setFavourites(JSON.parse(saved));
    }
  }, []);

  // Save favourites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const addToFavourites = (property) => {
    if (!favourites.find((fav) => fav.id === property.id)) {
      setFavourites([...favourites, property]);
    }
  };

  const removeFromFavourites = (propertyId) => {
    setFavourites(favourites.filter((fav) => fav.id !== propertyId));
  };

  const clearFavourites = () => {
    setFavourites([]);
  };

  return (
    <Router basename="/estate-react-app">
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <SearchPage
                properties={propertiesData.properties}
                favourites={favourites}
                addToFavourites={addToFavourites}
                removeFromFavourites={removeFromFavourites}
                clearFavourites={clearFavourites}
              />
            }
          />
          <Route
            path="/property/:id"
            element={
              <PropertyPage
                properties={propertiesData.properties}
                addToFavourites={addToFavourites}
                isFavourite={(id) => favourites.some((fav) => fav.id === id)}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;