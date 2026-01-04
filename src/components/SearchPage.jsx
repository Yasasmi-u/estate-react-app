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
  const [sortOption, setSortOption] = useState("featured");

  // ---------------- SEARCH LOGIC ----------------
  const handleSearch = ({ type, bedrooms, price, addedWithin, postcode }) => {
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

    // Filter by "added within"
    if (addedWithin !== "any") {
      const days = parseInt(addedWithin);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      results = results.filter((p) => {
        const addedDate = new Date(
          p.added.year,
          new Date(`${p.added.month} 1`).getMonth(),
          p.added.day
        );
        return addedDate >= cutoffDate;
      });
    }


    // Filter by postcode
    if (postcode && postcode.trim() !== "") {
      const sanitizedPostcode = DOMPurify.sanitize(
        postcode.trim().toUpperCase()
      );

      results = results.filter((p) => {
        const postcodeMatch = p.location.match(/([A-Z]{1,2}\d{1,2})/);
        return postcodeMatch
          ? postcodeMatch[0] === sanitizedPostcode
          : false;
      });
    }

    setFilteredProperties(results);
    setSortOption("featured");
    setHasSearched(true);
  };

  // ---------------- SORTING LOGIC ----------------
  const sortProperties = (list, option) => {
    const sorted = [...list];

    switch (option) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);

      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);

      case "bedrooms":
        return sorted.sort((a, b) => b.bedrooms - a.bedrooms);

      case "newest":
        return sorted.sort((a, b) => {
          const dateA = new Date(
            a.added.year,
            new Date(`${a.added.month} 1`).getMonth(),
            a.added.day
          );
          const dateB = new Date(
            b.added.year,
            new Date(`${b.added.month} 1`).getMonth(),
            b.added.day
          );
          return dateB - dateA;
        });

      case "featured":
      default:
        return sorted; 
    }
  };

  // ---------------- DRAG & DROP ----------------
  const handleDrop = (e, property) => {
    e.preventDefault();
    addToFavourites(property);
  };

  const handleDragStart = (e, property) => {
    e.dataTransfer.setData("property", JSON.stringify(property));
  };

  // ---------------- UI ----------------
  return (
    <div className="search-page">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>
          <span>Find Your Dream Home</span>
        </h1>
        <p>
          Search from properties across London and surrounding
          areas
        </p>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <h3>{properties.length}</h3>
          <p>Total Properties</p>
        </div>
        <div className="stat-card">
          <h3>{properties.filter((p) => p.type === "House").length}</h3>
          <p>Houses</p>
        </div>
        <div className="stat-card">
          <h3>{properties.filter((p) => p.type === "Flat").length}</h3>
          <p>Flats</p>
        </div>
        <div className="stat-card">
          <h3>{favourites.length}</h3>
          <p>Saved Properties</p>
        </div>
      </div>

      {/* ========== MAIN CONTENT LAYOUT ========== */}
      <div className="main-content search-layout">
        <aside className="search-sidebar">
          <SearchForm onSearch={handleSearch} />

          {!hasSearched && (
            <div className="hint">
              <h3>🏠 Welcome to Your Property Search</h3>
              <p>
                Use the search form above to find your perfect home. Filter by
                type, price, bedrooms, location and more!
              </p>
            </div>
          )}


          {/* ========== SEARCH RESULTS ========== */}
          {hasSearched && (
            <>
              <div className="results-header">
                <div className="results-count">
                  {filteredProperties.length}{" "}
                  {filteredProperties.length === 1
                    ? "property"
                    : "properties"}{" "}
                  found
                </div>
                
                {/* Sort dropdown */}
                <div className="sort-options">
                  <label htmlFor="sort-select" className="visually-hidden">
                    Sort properties
                  </label>

                  <select
                    id="sort-select"
                    aria-label="Sort properties"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="bedrooms">Most Bedrooms</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
              
              {/* No results message */}
              {filteredProperties.length === 0 ? (
                <div className="hint">
                  <h3>😕 No properties found</h3>
                  <p>Try adjusting your search criteria to see more results.</p>
                </div>
              ) : (

                /* Property cards grid */
                <div className="properties-grid">
                  {sortProperties(filteredProperties, sortOption).map(
                    (property) => (
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
                    )
                  )}
                </div>
              )}
            </>
          )}
        </aside>
        
        {/* ========== FAVOURITES SIDEBAR ========== */}
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
