// src/components/PropertyPage.jsx
import { useParams, Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import DOMPurify from "dompurify";

// Import all images
import prop1pic1 from "../assets/prop1pic1small.jpeg";
import prop1pic2 from "../assets/prop1pic2small.jpeg";
import prop1pic3 from "../assets/prop1pic3small.jpeg";
import prop1pic4 from "../assets/prop1pic4small.jpeg";
import prop1pic5 from "../assets/prop1pic5small.jpeg";
import prop1pic6 from "../assets/prop1pic6small.jpeg";

import prop2pic1 from "../assets/prop2pic1small.jpeg";
import prop2pic2 from "../assets/prop2pic2small.jpeg";
import prop2pic3 from "../assets/prop2pic3small.jpeg";
import prop2pic4 from "../assets/prop2pic4small.jpeg";
import prop2pic5 from "../assets/prop2pic5small.jpeg";
import prop2pic6 from "../assets/prop2pic6small.jpeg";

import prop3pic1 from "../assets/prop3pic1small.jpg";
import prop3pic2 from "../assets/prop3pic2small.jpg";
import prop3pic3 from "../assets/prop3pic3small.jpg";
import prop3pic4 from "../assets/prop3pic4small.jpg";
import prop3pic5 from "../assets/prop3pic5small.jpg";
import prop3pic6 from "../assets/prop3pic6small.jpg";

import prop4pic1 from "../assets/prop4pic1small.jpg";
import prop4pic2 from "../assets/prop4pic2small.jpg";
import prop4pic3 from "../assets/prop4pic3small.jpg";
import prop4pic4 from "../assets/prop4pic4small.jpg";
import prop4pic5 from "../assets/prop4pic5small.jpg";
import prop4pic6 from "../assets/prop4pic6small.jpg";

import prop5pic1 from "../assets/prop5pic1small.jpg";
import prop5pic2 from "../assets/prop5pic2small.jpg";
import prop5pic3 from "../assets/prop5pic3small.jpg";
import prop5pic4 from "../assets/prop5pic4small.jpg";
import prop5pic5 from "../assets/prop5pic5small.jpg";
import prop5pic6 from "../assets/prop5pic6small.jpg";

import prop6pic1 from "../assets/prop6pic1small.jpeg";
import prop6pic2 from "../assets/prop6pic2small.jpeg";
import prop6pic3 from "../assets/prop6pic3small.jpeg";
import prop6pic4 from "../assets/prop6pic4small.jpeg";
import prop6pic5 from "../assets/prop6pic5small.jpeg";
import prop6pic6 from "../assets/prop6pic6small.jpeg";

import prop7pic1 from "../assets/prop7pic1small.jpeg";
import prop7pic2 from "../assets/prop7pic2small.jpg";
import prop7pic3 from "../assets/prop7pic3small.jpeg";
import prop7pic4 from "../assets/prop7pic4small.jpeg";
import prop7pic5 from "../assets/prop7pic5small.jpeg";
import prop7pic6 from "../assets/prop7pic6small.jpeg";

const imagesMap = {
  prop1: [prop1pic1, prop1pic2, prop1pic3, prop1pic4, prop1pic5, prop1pic6],
  prop2: [prop2pic1, prop2pic2, prop2pic3, prop2pic4, prop2pic5, prop2pic6],
  prop3: [prop3pic1, prop3pic2, prop3pic3, prop3pic4, prop3pic5, prop3pic6],
  prop4: [prop4pic1, prop4pic2, prop4pic3, prop4pic4, prop4pic5, prop4pic6],
  prop5: [prop5pic1, prop5pic2, prop5pic3, prop5pic4, prop5pic5, prop5pic6],
  prop6: [prop6pic1, prop6pic2, prop6pic3, prop6pic4, prop6pic5, prop6pic6],
  prop7: [prop7pic1, prop7pic2, prop7pic3, prop7pic4, prop7pic5, prop7pic6],
};

function PropertyPage({ properties, addToFavourites, isFavourite }) {
  const { id } = useParams();
  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="property-page">
        <h1>Property Not Found</h1>
        <Link to="/">Back to Search</Link>
      </div>
    );
  }

  const images = imagesMap[property.id].map((img) => ({
    original: img,
    thumbnail: img,
  }));

  const isAlreadyFavourite = isFavourite(property.id);

  return (
    <div className="property-page">
      <Link to="/" className="back-link">
        ← Back to Search
      </Link>

      <div className="property-header">
        <h1>{DOMPurify.sanitize(property.type)}</h1>
        <p className="property-price">£{property.price.toLocaleString()}</p>
        <p className="property-location">{DOMPurify.sanitize(property.location)}</p>
        <p className="property-details">
          {property.bedrooms} Bedrooms | {DOMPurify.sanitize(property.tenure)}
        </p>
      </div>

      <button
        onClick={() => addToFavourites(property)}
        className="favourite-btn-page"
        disabled={isAlreadyFavourite}
      >
        {isAlreadyFavourite ? "✓ Added to Favourites" : "❤️ Add to Favourites"}
      </button>

      <div className="property-gallery">
        <ImageGallery items={images} />
      </div>

      <Tabs className="property-tabs">
        <TabList>
          <Tab>Description</Tab>
          <Tab>Floor Plan</Tab>
          <Tab>Map</Tab>
        </TabList>

        <TabPanel>
          <div className="tab-content">
            <h2>Property Description</h2>
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(property.description) }} />
          </div>
        </TabPanel>

        <TabPanel>
          <div className="tab-content">
            <h2>Floor Plan</h2>
            <p>Floor plan coming soon...</p>
            <div className="floor-plan-placeholder">
              📐 Floor Plan Image
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="tab-content">
            <h2>Location</h2>
            <div className="map-container">
              <iframe
                title="Property Location"
                width="100%"
                height="450"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
                  property.location
                )}`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default PropertyPage;