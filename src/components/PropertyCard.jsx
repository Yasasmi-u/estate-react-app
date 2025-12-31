// src/components/PropertyCard.jsx
import React from "react";
import PropTypes from "prop-types";
import "/App.css";

function PropertyCard({ property }) {
  return (
    <article className="property-card" aria-label={`Property: ${property.type}, ${property.bedrooms} bedrooms, ${property.location}`}>
      <a href={property.url} className="property-link">
        <img
          src={property.picture}
          alt={`Image of ${property.type} at ${property.location}`}
          className="property-image"
        />
      </a>
      <div className="property-info">
        <h2 className="property-type">{property.type}</h2>
        <p className="property-price">£{property.price.toLocaleString()}</p>
        <p className="property-location">{property.location}</p>
        <p className="property-description">
          {property.description.length > 150
            ? property.description.slice(0, 150) + "..."
            : property.description}
        </p>
        <a href={property.url} className="property-details-link">
          View Details
        </a>
      </div>
    </article>
  );
}

PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default PropertyCard;
