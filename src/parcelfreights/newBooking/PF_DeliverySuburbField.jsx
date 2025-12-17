'use client';

import { useState } from "react";
import Autosuggest from "react-autosuggest";
import suburbData from "../../assets/suburbData.json";
import { useJobStore } from "@/redux/store/store";

const DeliverySuburbField = ({ setDeliverySuburb, deliverySuburb, errors }) => {
  const [value, setValue] = useState(deliverySuburb || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isValid, setIsValid] = useState(false);

  // Filter suburbs based on user input
  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : suburbData.filter(
          (suburb) =>
            suburb.suburb.toLowerCase().includes(inputValue) ||
            suburb.postcode.includes(inputValue)
        );
  };

  // Handle input change
  const onChange = (event, { newValue }) => {
    setValue(newValue);
    setDeliverySuburb(newValue);
    setIsValid(false);
  };

  // Clear input if invalid selection on blur
  const onBlur = () => {
    if (!isValid) {
      setValue("");
      setDeliverySuburb("");
    }
  };

  // Fetch suggestions when user types
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  // Clear suggestions when dropdown closes
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Get formatted value when suggestion is selected
  const getSuggestionValue = (suggestion) => {
    setIsValid(true);
    return (
      suggestion.suburb.toUpperCase() +
      ", " +
      suggestion.postcode +
      ", " +
      suggestion.state
    );
  };

  // Handle suggestion selection
  const handleSuggestionSelected = (event, { suggestion }) => {
    delete errors?.deliverySuburb;
    setIsValid(true);
  };

  // Render each suggestion with improved styling
  const renderSuggestion = (suggestion) => {
    return (
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors duration-150 cursor-pointer">
        <svg 
          className="w-4 h-4 text-gray-400 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-700">
            {suggestion.suburb}
          </span>
          <span className="text-sm text-gray-500 ml-2">
            {suggestion.postcode}, {suggestion.state}
          </span>
        </div>
      </div>
    );
  };

  // Custom container for suggestions dropdown
  const renderSuggestionsContainer = ({ containerProps, children }) => {
    const { key, ...restProps } = containerProps;
    return (
      <div 
        key={key}
        {...restProps} 
        className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        <div className="max-h-[400px] overflow-y-auto">
          {children}
        </div>
        {suggestions.length > 15 && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600">
              Showing first 15 results. Keep typing to refine...
            </p>
          </div>
        )}
      </div>
    );
  };

  // Input field properties
  const inputProps = {
    placeholder: "Type a suburb name or postcode",
    value,
    onChange: onChange,
    onBlur: onBlur,
    className: `w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF7D44] ${
      errors?.deliverySuburb 
        ? 'border-red-300 bg-red-50 focus:border-red-500' 
        : 'border-gray-200 focus:border-[#FF7D44]'
    }`,
  };

  // Theme for Autosuggest component
  const theme = {
    container: 'relative',
    suggestionsContainer: 'absolute z-50 w-full',
    suggestionsList: 'divide-y divide-gray-100',
    suggestion: 'cursor-pointer',
    suggestionHighlighted: 'bg-orange-50',
  };

  return (
    <div className="relative">
      <Autosuggest
        suggestions={suggestions.slice(0, 15)}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSuggestionsContainer={renderSuggestionsContainer}
        onSuggestionSelected={handleSuggestionSelected}
        inputProps={inputProps}
        theme={theme}
      />
      {errors?.deliverySuburb && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.deliverySuburb}
        </p>
      )}
    </div>
  );
};

export default DeliverySuburbField;