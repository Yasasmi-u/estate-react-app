// SearchForm.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import Slider from "rc-slider";
import "react-datepicker/dist/react-datepicker.css";
import "rc-slider/assets/index.css";

const SearchForm = ({ onSearch }) => {
  const [type, setType] = useState(null);
  const [bedrooms, setBedrooms] = useState([1, 5]);
  const [price, setPrice] = useState([100000, 1500000]);
  const [dateAdded, setDateAdded] = useState(null);
  const [postcode, setPostcode] = useState("");

  const typeOptions = [
    { value: "Any", label: "Any" },
    { value: "House", label: "House" },
    { value: "Flat", label: "Flat" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ type, bedrooms, price, dateAdded, postcode });
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      {/* Property Type */}
      <label htmlFor="type-select">Property Type</label>
      <Select
        inputId="type-select"
        options={typeOptions}
        value={typeOptions.find((opt) => opt.value === type)}
        onChange={(selected) => setType(selected?.value || "Any")}
        placeholder="Select type..."
        aria-label="Select property type"
      />

      {/* Price Range */}
      <label htmlFor="price-slider">Price Range (£)</label>
      <Slider
        id="price-slider"
        range
        min={50000}
        max={2000000}
        defaultValue={price}
        onChange={(val) => setPrice(val)}
        aria-label="Select price range"
      />
      <div aria-live="polite">
        £{price[0]} - £{price[1]}
      </div>

      {/* Bedrooms */}
      <label htmlFor="bedrooms-slider">Bedrooms</label>
      <Slider
        id="bedrooms-slider"
        range
        min={1}
        max={6}
        defaultValue={bedrooms}
        onChange={(val) => setBedrooms(val)}
        aria-label="Select number of bedrooms"
      />
      <div aria-live="polite">{bedrooms[0]} - {bedrooms[1]}</div>

      {/* Date Added */}
      <label htmlFor="date-picker">Date Added</label>
      <DatePicker
        id="date-picker"
        selected={dateAdded}
        onChange={(date) => setDateAdded(date)}
        placeholderText="Select a date"
        aria-label="Select date added"
      />

      {/* Postcode */}
      <label htmlFor="postcode-input">Postcode Area</label>
      <input
        id="postcode-input"
        type="text"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value.toUpperCase())}
        placeholder="e.g. BR1, NW1"
        aria-label="Enter postcode area"
      />

      <button type="submit" aria-label="Search Properties">Search</button>
      <button type="button" onClick={() => window.location.reload()} aria-label="Clear Search Form">Clear</button>
    </form>
  );
};

export default SearchForm;
