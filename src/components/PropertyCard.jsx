// src/components/PropertyCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";


import prop1pic1 from "../assets/prop1pic1small.jpeg";
import prop2pic1 from "../assets/prop2pic1small.jpeg";
import prop3pic1 from "../assets/prop3pic1small.jpeg";
import prop4pic1 from "../assets/prop4pic1small.jpeg";
import prop5pic1 from "../assets/prop5pic1small.jpeg";
import prop6pic1 from "../assets/prop6pic1small.jpeg";
import prop7pic1 from "../assets/prop7pic1small.jpeg";


const imagesMap = {
  prop1: prop1pic1,
  prop2: prop2pic1,
  prop3: prop3pic1,
  prop4: prop4pic1,
  prop5: prop5pic1,
  prop6: prop6pic1,
  prop7: prop7pic1,
};

function PropertyCard({ property , onAddToFavourites}) {
  const mainImage = imagesMap[property.id];

  // Sanitize description to prevent XSS
  const sanitizedDescription = DOMPurify.sanitize(property.description);

  const truncatedDescription =
    sanitizedDescription.length > 140
      ? sanitizedDescription.slice(0, 140) + "..."
      : sanitizedDescription;

  return (
    <article className="property-card" aria-label={`Property ${property.type}`}>
      <img
        src={mainImage}
        alt={`${property.type} at ${DOMPurify.sanitize(property.location)}`}
        className="property-image"
        loading="lazy"
      />

      <div className="property-info">
        <h2>{DOMPurify.sanitize(property.type)}</h2>
        <p className="price">£{property.price.toLocaleString()}</p>
        <p className="location">{DOMPurify.sanitize(property.location)}</p>
        <p className="description">{truncatedDescription}</p>
      
        <div className="card-actions">
          <Link to={`/property/${property.id}`} className="details-link">
            View Details
          </Link>
          <button
            onClick={() => onAddToFavourites(property)}
            className="favourite-btn"
            aria-label="Add to favourites"
          >
            ❤️ Add to Favourites
          </button>
        </div>
      </div>
    </article>
  );
}

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
  onAddToFavourites: PropTypes.func.isRequired,
};

export default PropertyCard;