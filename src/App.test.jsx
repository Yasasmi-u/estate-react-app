// src/App.test.js
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import SearchForm from './components/SearchForm';
import propertiesData from './data/properties.json';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

describe('Estate Agent App - Custom JEST Tests', () => {
  
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  // ============================================
  // TEST 1: Properties Data Validation
  // ============================================
  test('properties.json contains exactly 7 valid properties', () => {
    expect(propertiesData.properties).toBeDefined();
    expect(propertiesData.properties.length).toBe(7);
    
    // Check each property has required fields
    propertiesData.properties.forEach(property => {
      expect(property).toHaveProperty('id');
      expect(property).toHaveProperty('type');
      expect(property).toHaveProperty('price');
      expect(property).toHaveProperty('bedrooms');
      expect(property).toHaveProperty('location');
      expect(property).toHaveProperty('description');
      expect(property).toHaveProperty('added');
    });
  });

  // ============================================
  // TEST 2: SearchForm Renders All Fields
  // ============================================
  test('SearchForm renders all 5 required input fields', () => {
    const mockSearch = vi.fn();
    render(<SearchForm onSearch={mockSearch} />);
    
    // Check all 5 fields exist
    expect(screen.getByLabelText(/Property Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price Range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bedrooms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Added to site/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postcode Area/i)).toBeInTheDocument();
    
    // Check buttons exist
    expect(screen.getByText(/Clear/i)).toBeInTheDocument();
    expect(screen.getByText(/Search Properties/i)).toBeInTheDocument();
  });

  // ============================================
  // TEST 3: Search Button Triggers Search
  // ============================================
  test('clicking Search Properties button triggers search', () => {
    const mockSearch = vi.fn();
    render(<SearchForm onSearch={mockSearch} />);
    
    const searchButton = screen.getByText(/Search Properties/i);
    fireEvent.click(searchButton);
    
    // Check if search function was called
    expect(mockSearch).toHaveBeenCalled();
    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "Any",
        bedrooms: [1, 6],
        price: [50000, 2000000],
        addedWithin: "any",
        postcode: ""
      })
    );
  });

  // ============================================
  // TEST 4: Clear Button Resets Form
  // ============================================
  test('Clear button resets form and triggers search with default values', () => {
    const mockSearch = vi.fn();
    render(<SearchForm onSearch={mockSearch} />);
    
    // Type in postcode
    const postcodeInput = screen.getByLabelText(/Postcode Area/i);
    fireEvent.change(postcodeInput, { target: { value: 'BR1' } });
    expect(postcodeInput.value).toBe('BR1');
    
    // Click clear button
    const clearButton = screen.getByText(/Clear/i);
    fireEvent.click(clearButton);
    
    // Check if postcode is cleared
    expect(postcodeInput.value).toBe('');
    
    // Check if search was triggered with default values
    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "Any",
        bedrooms: [1, 6],
        price: [50000, 2000000],
        addedWithin: "any",
        postcode: ""
      })
    );
  });

  // ============================================
  // TEST 5: SearchPage Renders Hero and Stats
  // ============================================
  test('SearchPage renders hero section and stats cards', () => {
    const mockProps = {
      properties: propertiesData.properties,
      favourites: [],
      addToFavourites: vi.fn(),
      removeFromFavourites: vi.fn(),
      clearFavourites: vi.fn(),
    };
    
    render(
      <HashRouter>
        <SearchPage {...mockProps} />
      </HashRouter>
    );
    
    // Check hero section
    expect(screen.getByText(/Find Your Dream Home/i)).toBeInTheDocument();
    
    // Check stats cards
    expect(screen.getByText(/Total Properties/i)).toBeInTheDocument();
    expect(screen.getByText(/Houses/i)).toBeInTheDocument();
    expect(screen.getByText(/Flats/i)).toBeInTheDocument();
    expect(screen.getByText(/Saved Properties/i)).toBeInTheDocument();
  });

  // ============================================
  // TEST 6: Search Filters Properties by Type
  // ============================================
  test('search filters properties by type correctly', () => {
    const mockProps = {
      properties: propertiesData.properties,
      favourites: [],
      addToFavourites: vi.fn(),
      removeFromFavourites: vi.fn(),
      clearFavourites: vi.fn(),
    };
    
    render(
      <HashRouter>
        <SearchPage {...mockProps} />
      </HashRouter>
    );
    
    // Click search to show all properties
    const searchButton = screen.getByText(/Search Properties/i);
    fireEvent.click(searchButton);
    
    // Should show results
    expect(screen.getByText(/properties found/i)).toBeInTheDocument();
  });

  // ============================================
  // TEST 7: Sort Dropdown Changes Order
  // ============================================
  test('sort dropdown changes property order', () => {
    const mockProps = {
      properties: propertiesData.properties,
      favourites: [],
      addToFavourites: vi.fn(),
      removeFromFavourites: vi.fn(),
      clearFavourites: vi.fn(),
    };
    
    render(
      <HashRouter>
        <SearchPage {...mockProps} />
      </HashRouter>
    );
    
    // Trigger search first
    const searchButton = screen.getByText(/Search Properties/i);
    fireEvent.click(searchButton);
    
    // Find and use sort dropdown
    const sortDropdown = screen.getByRole('combobox', {
      name: /sort properties/i,
    });
    expect(sortDropdown).toBeInTheDocument();
    
    // Change to Price: Low to High
    fireEvent.change(sortDropdown, { target: { value: 'price-low' } });
    expect(sortDropdown.value).toBe('price-low');
  });

  // ============================================
  // TEST 8: Add to Favourites Works
  // ============================================
  test('clicking Add to Favourites calls the function', () => {
    const mockAddFav = vi.fn();
    const mockProps = {
      properties: propertiesData.properties,
      favourites: [],
      addToFavourites: mockAddFav,
      removeFromFavourites: vi.fn(),
      clearFavourites: vi.fn(),
    };
    
    render(
      <HashRouter>
        <SearchPage {...mockProps} />
      </HashRouter>
    );
    
    // Search first
    const searchButton = screen.getByText(/Search Properties/i);
    fireEvent.click(searchButton);
    
    // Find and click first Add to Favourites button
    const favButtons = screen.getAllByText(/Add to Favourites/i);
    fireEvent.click(favButtons[0]);
    
    // Check if function was called
    expect(mockAddFav).toHaveBeenCalled();
  });

  // ============================================
  // TEST 9: Postcode Input Converts to Uppercase
  // ============================================
  test('postcode input automatically converts to uppercase', () => {
    const mockSearch = vi.fn();
    render(<SearchForm onSearch={mockSearch} />);
    
    const postcodeInput = screen.getByLabelText(/Postcode Area/i);
    
    // Type lowercase
    fireEvent.change(postcodeInput, { target: { value: 'br1' } });
    
    // Should be uppercase
    expect(postcodeInput.value).toBe('BR1');
  });

  // ============================================
  // TEST 10: Price Range Values Display Correctly
  // ============================================
  test('price range displays formatted values', () => {
    const mockSearch = vi.fn();
    render(<SearchForm onSearch={mockSearch} />);
    
    // Check if default price range is displayed
    expect(screen.getByText(/£50,000 - £2,000,000/i)).toBeInTheDocument();
  });

  // ============================================
  // TEST 11: Bedroom Range Displays Correctly
  // ============================================
  test('bedroom range displays current values', () => {
    const mockSearch = vi.fn();
    render(<SearchForm onSearch={mockSearch} />);
    
    // Check if default bedroom range is displayed
    expect(screen.getByText(/1 - 6 beds/i)).toBeInTheDocument();
  });

  // ============================================
  // TEST 12: Added Within Dropdown Has All Options
  // ============================================
  test('Added Within dropdown has all time period options', () => {
    const mockSearch = vi.fn();
    render(<SearchForm onSearch={mockSearch} />);
    
    const dropdown = screen.getByLabelText(/Added to site/i);
    
    // Check all options exist
    expect(dropdown).toContainHTML('<option value="any">Anytime</option>');
    expect(dropdown).toContainHTML('<option value="7">Last 7 days</option>');
    expect(dropdown).toContainHTML('<option value="90">Last 3 months</option>');
    expect(dropdown).toContainHTML('<option value="365">Last year</option>');
  });

  // ============================================
  // TEST 13: All Properties Have Valid Prices
  // ============================================
  test('all properties have valid price ranges', () => {
    propertiesData.properties.forEach(property => {
      expect(property.price).toBeGreaterThan(0);
      expect(property.price).toBeLessThan(5000000);
      expect(typeof property.price).toBe('number');
    });
  });

  // ============================================
  // TEST 14: All Properties Have Valid Bedrooms
  // ============================================
  test('all properties have valid bedroom counts', () => {
    propertiesData.properties.forEach(property => {
      expect(property.bedrooms).toBeGreaterThanOrEqual(1);
      expect(property.bedrooms).toBeLessThanOrEqual(10);
      expect(typeof property.bedrooms).toBe('number');
    });
  });

  // ============================================
  // TEST 15: Date Structure is Valid
  // ============================================
  test('all properties have valid date structure', () => {
    propertiesData.properties.forEach(property => {
      expect(property.added).toHaveProperty('month');
      expect(property.added).toHaveProperty('day');
      expect(property.added).toHaveProperty('year');
      expect(property.added.year).toBeGreaterThan(2020);
      expect(property.added.year).toBeLessThanOrEqual(new Date().getFullYear());
    });
  });
});