// SearchForm.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import Slider from "rc-slider";
import "react-datepicker/dist/react-datepicker.css";
import "rc-slider/assets/index.css";

const SearchForm = ({ onSearch }) => {
  const [type, setType] = useState(null);
  const [bedrooms, setBedrooms] = useState([1, 6]);
  const [price, setPrice] = useState([50000, 2000000]);
  const [dateAdded, setDateAdded] = useState(null);
  const [postcode, setPostcode] = useState("");

  const typeOptions = [
    { value: "Any", label: "Any" },
    { value: "House", label: "House" },
    { value: "Flat", label: "Flat" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ 
      type: type?.value || "Any", 
      bedrooms, 
      price, 
      dateAdded, 
      postcode, 
    });
  };

  const handleReset = () => {
    setType(null);
    setBedrooms([1,6]);
    setPrice([50000,2000000]);
    setDateAdded(null);
    setPostcode("");
  }

  return (
    <form onSubmit={handleSearch} className="search-form">
      {/* Property Type */}
      <div className="form-group">
        <label htmlFor="type-select">Property Type</label>
        <Select
          inputId="type-select"
          options={typeOptions}
          value={type}
          onChange={(selected) => setType(selected)}
          placeholder="Select type..."
          aria-label="Select property type"
          isClearable
        />
      </div>  

      {/* Price Range */}
      <div className="form-group">
        <label htmlFor="price-slider">
          Price Range: £{price[0].toLocaleString()} - £{price[1].toLocaleString()}
        </label>
        <Slider
          id="price-slider"
          range
          min={50000}
          max={2000000}
          step={10000}
          value={price}
          onChange={(val) => setPrice(val)}
          aria-label="Select price range"
        />
      </div>

      {/* Bedrooms */}
      <div className="form-group">
        <label htmlFor="bedrooms-slider">
          Bedrooms: {bedrooms[0]} - {bedrooms[1]}
        </label>
        <Slider
          id="bedrooms-slider"
          range
          min={1}
          max={6}
          value={bedrooms}
          onChange={(val) => setBedrooms(val)}
          aria-label="Select number of bedrooms"
        />
      </div>

      {/* Date Added */}
      <div className="form-group">
        <label htmlFor="date-picker">Date Added (after this date)</label>
        <DatePicker
          id="date-picker"
          selected={dateAdded}
          onChange={(date) => setDateAdded(date)}
          placeholderText="Select a date"
          aria-label="Select date added"
          dateFormat="dd/MM/yyyy"
          isClearable
        />
      </div>

      {/* Postcode */}
      <div className="form-group">
        <label htmlFor="postcode-input">Postcode Area (e.g. BR1, NW1)</label>
        <input
          id="postcode-input"
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          placeholder="e.g. BR1, NW1"
          aria-label="Enter postcode area"
        />
      </div>

      <div className="form-actions">
        <button type="submit" aria-label="Search Properties">
          Search
        </button>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Clear Search Form"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
