// src/components/FavouritesList.jsx
import React from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

function FavouritesList({
  favourites,
  removeFromFavourites,
  clearFavourites,
  onDrop,
}) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropInList = (e) => {
    e.preventDefault();
    const property = JSON.parse(e.dataTransfer.getData("property"));
    onDrop(e, property);
  };

  const handleDragStart = (e, propertyId) => {
    e.dataTransfer.setData("removeId", propertyId);
  };

  const handleDropOutside = (e) => {
    e.preventDefault();
    const removeId = e.dataTransfer.getData("removeId");
    if (removeId) {
      removeFromFavourites(removeId);
    }
  };

  return (
    <aside className="favourites-sidebar">
      <h2>Favourites ({favourites.length})</h2>

      <div
        className="favourites-drop-zone"
        onDragOver={handleDragOver}
        onDrop={handleDropInList}
      >
        {favourites.length === 0 ? (
          <p className="empty-message">Drag properties here to add to favourites</p>
        ) : (
          <ul className="favourites-list">
            {favourites.map((property) => (
              <li
                key={property.id}
                className="favourite-item"
                draggable
                onDragStart={(e) => handleDragStart(e, property.id)}
              >
                <Link to={`/property/${property.id}`}>
                  <h3>{DOMPurify.sanitize(property.type)}</h3>
                  <p className="fav-price">£{property.price.toLocaleString()}</p>
                  <p className="fav-location">{DOMPurify.sanitize(property.location)}</p>
                </Link>
                <button
                  onClick={() => removeFromFavourites(property.id)}
                  className="remove-btn"
                  aria-label="Remove from favourites"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {favourites.length > 0 && (
        <button onClick={clearFavourites} className="clear-btn">
          Clear All Favourites
        </button>
      )}

      <div
        className="drag-to-remove"
        onDragOver={handleDragOver}
        onDrop={handleDropOutside}
      >
        🗑️ Drag here to remove
      </div>
    </aside>
  );
}

export default FavouritesList;