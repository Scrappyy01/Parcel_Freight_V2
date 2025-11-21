'use client';

import { useState } from "react";
import Autosuggest from "react-autosuggest";
import suburbData from "../../assets/suburbData.json";
import { useJobStore } from "@/redux/store/store";

const DeliverySuburbField = ({ setDeliverySuburb, deliverySuburb, errors }) => {
  const [value, setValue] = useState(deliverySuburb || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isValid, setIsValid] = useState(false);

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

  const onChange = (event, { newValue }) => {
    setValue(newValue);
    setDeliverySuburb(newValue);
    setIsValid(false);
  };

  const onBlur = () => {
    if (!isValid) {
      setValue("");
      setDeliverySuburb("");
    }
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

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

  const handleSuggestionSelected = (event, { suggestion }) => {
    delete errors?.deliverySuburb;
    setIsValid(true);
  };

  const renderSuggestion = (suggestion) => {
    return (
      <div>
        {suggestion.suburb}, {suggestion.postcode}, {suggestion.state}
      </div>
    );
  };

  const inputProps = {
    placeholder: "Type a suburb name or postcode",
    value,
    onChange: onChange,
    onBlur: onBlur,
    className: `react-autosuggest__input ${errors?.deliverySuburb ? "border-red-500" : ""}`,
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={handleSuggestionSelected}
      inputProps={inputProps}
    />
  );
};

export default DeliverySuburbField;



