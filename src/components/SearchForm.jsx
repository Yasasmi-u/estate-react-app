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
      <label>Property Type</label>
      <Select
        options={typeOptions}
        value={type}
        onChange={(selected) => setType(selected?.value || "Any")}
        placeholder="Select type..."
      />

      {/* Price Range */}
      <label>Price Range (£)</label>
      <Slider
        range
        min={50000}
        max={2000000}
        defaultValue={price}
        onChange={(val) => setPrice(val)}
      />
      <div>
        £{price[0]} - £{price[1]}
      </div>

      {/* Bedrooms */}
      <label>Bedrooms</label>
      <Slider
        range
        min={1}
        max={6}
        defaultValue={bedrooms}
        onChange={(val) => setBedrooms(val)}
      />
      <div>{bedrooms[0]} - {bedrooms[1]}</div>

      {/* Date Added */}
      <label>Date Added</label>
      <DatePicker
        selected={dateAdded}
        onChange={(date) => setDateAdded(date)}
        placeholderText="Select a date"
      />

      {/* Postcode */}
      <label>Postcode Area</label>
      <input
        type="text"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value.toUpperCase())}
        placeholder="e.g. BR1, NW1"
      />

      <button type="submit">Search</button>
      <button type="button" onClick={() => window.location.reload()}>Clear</button>
    </form>
  );
};

export default SearchForm;
