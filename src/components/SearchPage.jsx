// src/pages/SearchPage.jsx
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
      {/* Hero Section */}
      <div className="hero-section">
        <h1><span>Find Your Dream Home</span></h1>
        <p>Search from properties across London and surrounding areas</p>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <h3>{properties.length}</h3>
          <p>Total Properties</p>
        </div>
        <div className="stat-card">
          <h3>{properties.filter(p => p.type === "House").length}</h3>
          <p>Houses</p>
        </div>
        <div className="stat-card">
          <h3>{properties.filter(p => p.type === "Flat").length}</h3>
          <p>Flats</p>
        </div>
        <div className="stat-card">
          <h3>{favourites.length}</h3>
          <p>Saved Properties</p>
        </div>
      </div>

      <div className="main-content">
        <div className="search-section">
          <SearchForm onSearch={handleSearch} />

          {!hasSearched && (
            <div className="hint">
              <h3>🏠 Welcome to Your Property Search</h3>
              <p>Use the search form above to find your perfect home. Filter by type, price, bedrooms, location and more!</p>
            </div>
          )}

          {hasSearched && (
            <>
              <div className="results-header">
                <div className="results-count">
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
                </div>
                <div className="sort-options">
                  <select defaultValue="featured">
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="bedrooms">Most Bedrooms</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="hint">
                  <h3>😕 No properties found</h3>
                  <p>Try adjusting your search criteria to see more results.</p>
                </div>
              ) : (
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
              )}
            </>
          )}
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