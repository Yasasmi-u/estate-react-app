import React from "react";
import { useState } from "react";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

/**
 * SearchForm Component
 * 
 * Provides a comprehensive search interface for filtering properties.
 * Uses React widgets (react-select, rc-slider) for enhanced user experience.
 * 
 * @param {Function} onSearch - Callback function triggered when search is submitted
 */
const SearchForm = ({ onSearch }) => {
  // ========== STATE MANAGEMENT ==========
  // Stores the selected property type (House, Flat, or Any)
  const [type, setType] = useState(null);
  
  // Stores the bedroom range [min, max]
  const [bedrooms, setBedrooms] = useState([1, 6]);
  
  // Stores the price range [min, max] in pounds
  const [price, setPrice] = useState([50000, 2000000]);
  
  // Stores the time period filter for when property was added
  const [addedWithin, setAddedWithin] = useState(null);
  
  // Stores the postcode search term (auto-converted to uppercase)
  const [postcode, setPostcode] = useState("");

  // ========== DROPDOWN OPTIONS ==========
  // Options for property type dropdown (react-select)
  const typeOptions = [
    { value: "Any", label: "Any" },
    { value: "House", label: "House" },
    { value: "Flat", label: "Flat" },
  ];

  // Options for "Added to site" dropdown (react-select)
  const addedWithinOptions = [
    { value: "any", label: "Anytime" },
    { value: "7", label: "Last 7 days" },
    { value: "90", label: "Last 3 months" },
    { value: "365", label: "Last year" },
  ];

  // ========== EVENT HANDLERS ==========
  /**
   * Handles form submission
   * Prevents default form behavior and triggers search with current filter values
   */
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      type: type?.value || "Any",
      bedrooms,
      price,
      addedWithin: addedWithin?.value || "any",
      postcode,
    });
  };

  /**
   * Resets all form fields to default values
   * Also triggers a search with default parameters to show all properties
   */
  const handleReset = () => {
    setType(null);
    setBedrooms([1, 6]);
    setPrice([50000, 2000000]);
    setAddedWithin(null);
    setPostcode("");

    // Trigger search with default values
    onSearch({
      type: "Any",
      bedrooms: [1, 6],
      price: [50000, 2000000],
      addedWithin: "any",
      postcode: "",
    });
  };

  /**
   * Handles postcode input changes
   * Automatically converts input to uppercase for consistency
   */
  const handlePostcodeChange = (selectedOption) => {
    if (selectedOption && selectedOption.__isNew__) {
      // User typed a custom value
      setPostcode(selectedOption.value.toUpperCase());
    } else if (selectedOption) {
      // User selected from suggestions
      setPostcode(selectedOption.value.toUpperCase());
    } else {
      // User cleared the field
      setPostcode("");
    }
  };

  // Postcode suggestions for react-select (creatable)
  const postcodeOptions = [
    { value: "BR1", label: "BR1 - Bromley" },
    { value: "BR5", label: "BR5 - Orpington" },
    { value: "BR6", label: "BR6 - Orpington" },
    { value: "NW1", label: "NW1 - Camden" },
    { value: "NW3", label: "NW3 - Hampstead" },
    { value: "N1", label: "N1 - Islington" },
    { value: "CR0", label: "CR0 - Croydon" },
  ];

  // Custom styles for react-select to match the design
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: '4px 8px',
      borderRadius: '10px',
      border: state.isFocused ? '2px solid #00c8b4' : '2px solid #e8e8e8',
      backgroundColor: state.isFocused ? 'white' : '#fafafa',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(0, 200, 180, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#00c8b4',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#00c8b4' : state.isFocused ? '#f0f0f0' : 'white',
      color: state.isSelected ? 'white' : '#333',
      '&:hover': {
        backgroundColor: state.isSelected ? '#00c8b4' : '#e8e8e8',
      },
    }),
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      {/* ========== PROPERTY TYPE DROPDOWN ========== */}
      <div className="form-group">
        <label htmlFor="type-select">Property Type</label>
        <Select
          inputId="type-select"
          options={typeOptions}
          value={type}
          onChange={(selected) => setType(selected)}
          placeholder="Any"
          isClearable
          styles={customSelectStyles}
          aria-label="Select property type"
        />
      </div>

      {/* ========== PRICE RANGE SLIDER ========== */}
      <div className="form-group">
        <label htmlFor="price-range-input">Price Range</label>

        {/* Hidden input for accessibility & testing */}
        <input
          id="price-range-input"
          type="range"
          style={{ display: "none" }}
          aria-hidden="false"
        />

        {/* RC Slider component for visual price range selection */}
        <Slider
          range
          min={50000}
          max={2000000}
          step={10000}
          value={price}
          onChange={(val) => setPrice(val)}
          aria-label="Select price range"
        />

        {/* Display current price range values */}
        <div className="slider-value">
          £{price[0].toLocaleString()} - £{price[1].toLocaleString()}
        </div>
      </div>

      {/* ========== BEDROOMS RANGE SLIDER ========== */}
      <div className="form-group">
        <label htmlFor="bedrooms-input">Bedrooms</label>

        {/* Hidden input for accessibility */}
        <input
          id="bedrooms-input"
          type="range"
          style={{ display: "none" }}
          aria-hidden="false"
        />

        {/* RC Slider component for bedroom range selection */}
        <Slider
          range
          min={1}
          max={6}
          value={bedrooms}
          onChange={(val) => setBedrooms(val)}
          aria-label="Select bedroom range"
        />

        {/* Display current bedroom range values */}
        <div className="slider-value">
          {bedrooms[0]} - {bedrooms[1]} beds
        </div>
      </div>

      {/* ========== ADDED TO SITE DROPDOWN (NOW REACT-SELECT) ========== */}
      <div className="form-group">
        <label htmlFor="added-within-select">Added to site</label>
        <Select
          inputId="added-within-select"
          options={addedWithinOptions}
          value={addedWithin}
          onChange={(selected) => setAddedWithin(selected)}
          placeholder="Anytime"
          isClearable
          styles={customSelectStyles}
          aria-label="Select when property was added"
        />
      </div>

      {/* ========== POSTCODE AREA (NOW REACT-SELECT CREATABLE) ========== */}
      <div className="form-group">
        <label htmlFor="postcode-select">Postcode Area</label>
        <Select
          inputId="postcode-select"
          options={postcodeOptions}
          value={postcode ? { value: postcode, label: postcode } : null}
          onChange={handlePostcodeChange}
          placeholder="e.g. BR1, NW1"
          isClearable
          styles={customSelectStyles}
          aria-label="Enter or select postcode area"
          // Allow user to type custom postcodes
          onInputChange={(inputValue) => {
            // Only update if user is typing (not selecting)
            if (inputValue) {
              const upperInput = inputValue.toUpperCase();
              setPostcode(upperInput);
            }
          }}
        />
      </div>

      {/* ========== FORM ACTION BUTTONS ========== */}
      <div className="form-actions">
        {/* Clear button - resets all filters to defaults */}
        <button type="button" onClick={handleReset} aria-label="Clear all filters">
          Clear
        </button>
        
        {/* Submit button - triggers property search */}
        <button type="submit" aria-label="Search for properties">
          Search Properties
        </button>
      </div>
    </form>
  );
};

export default SearchForm;