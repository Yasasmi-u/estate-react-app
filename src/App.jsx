// App.jsx
import React, { useState } from "react";
import propertiesData from "./data/properties.json";
import SearchForm from "./components/SearchForm";
import PropertyCard from "./components/PropertyCard";
import "./App.css";

function App() {
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = ({ type, bedrooms, price, dateAdded, postcode }) => {
    let results = propertiesData.properties;

    if (type && type !== "Any") {
      results = results.filter((p) => p.type === type);
    }
    if (bedrooms) {
      results = results.filter((p) => p.bedrooms >= bedrooms[0] && p.bedrooms <= bedrooms[1]);
    }
    if (price) {
      results = results.filter((p) => p.price >= price[0] && p.price <= price[1]);
    }
    if (dateAdded) {
      results = results.filter(p => {
        const addedDate = new Date(
          p.added.year,
          new Date(`${p.added.month} 1`).getMonth(),
          p.added.day
        );
        return addedDate >= dateAdded;
      });
    }
    if (postcode) {
      results = results.filter((p) => p.location.toUpperCase().startsWith(postcode));
    }

    setFilteredProperties(results);
    setHasSearched(true);
  };

  return (
    <div className="App">
      <h1>Property Search</h1>

      <SearchForm onSearch={handleSearch} />

      {!hasSearched && (
        <p className="hint">Use the search form to find properties.</p>
      )}

      {hasSearched && filteredProperties.length === 0 && (
        <p className="hint">No properties match your criteria.</p>
      )}

      <div className="properties-grid">
        {filteredProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

export default App;
