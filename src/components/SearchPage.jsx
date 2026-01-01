// src/components/SearchPage.jsx
import { useState } from "react";
import SearchForm from "../components/SearchForm";
import PropertyCard from "../components/PropertyCard";
import FavouritesList from "../components/FavouritesList";
import DOMPurify from "dompurify";

function SearchPage({
  properties,
  favourites,
  addToFavourites,
  removeFromFavourites,
  clearFavourites,
}) {
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = ({ type, bedrooms, price, dateAdded, postcode }) => {
    let results = properties;

    // Filter by type
    if (type && type !== "Any") {
      results = results.filter((p) => p.type === type);
    }

    // Filter by bedrooms
    if (bedrooms) {
      results = results.filter(
        (p) => p.bedrooms >= bedrooms[0] && p.bedrooms <= bedrooms[1]
      );
    }

    // Filter by price
    if (price) {
      results = results.filter(
        (p) => p.price >= price[0] && p.price <= price[1]
      );
    }

    // Filter by date added
    if (dateAdded) {
      results = results.filter((p) => {
        const addedDate = new Date(
          p.added.year,
          new Date(`${p.added.month} 1`).getMonth(),
          p.added.day
        );
        return addedDate >= dateAdded;
      });
    }

    // Filter by postcode (first part only, e.g., BR1, NW1)
    if (postcode && postcode.trim() !== "") {
      const sanitizedPostcode = DOMPurify.sanitize(postcode.trim().toUpperCase());
      results = results.filter((p) => {
        const propertyPostcode = p.location.split(" ").pop().split("")[0] + 
                                 p.location.split(" ").pop().match(/\d+/)?.[0] || "";
        // Extract postcode area from location (e.g., "BR5" from "Orpington BR5")
        const postcodeMatch = p.location.match(/([A-Z]{1,2}\d{1,2})/);
        if (postcodeMatch) {
          return postcodeMatch[0] === sanitizedPostcode;
        }
        return false;
      });
    }

    setFilteredProperties(results);
    setHasSearched(true);
  };

  const handleDrop = (e, property) => {
    e.preventDefault();
    addToFavourites(property);
  };

  const handleDragStart = (e, property) => {
    e.dataTransfer.setData("property", JSON.stringify(property));
  };

  return (
    <div className="search-page">
      <h1>Property Search</h1>

      <div className="main-content">
        <div className="search-section">
          <SearchForm onSearch={handleSearch} />

          {!hasSearched && (
            <p className="hint">Use the search form above to find properties.</p>
          )}

          {hasSearched && filteredProperties.length === 0 && (
            <p className="hint">No properties match your search criteria.</p>
          )}

          <div className="properties-grid">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                draggable
                onDragStart={(e) => handleDragStart(e, property)}
              >
                <PropertyCard
                  property={property}
                  onAddToFavourites={addToFavourites}
                />
              </div>
            ))}
          </div>
        </div>

        <FavouritesList
          favourites={favourites}
          removeFromFavourites={removeFromFavourites}
          clearFavourites={clearFavourites}
          onDrop={handleDrop}
        />
      </div>
    </div>
  );
}

export default SearchPage;