'use client';

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Input Component - Tailwind CSS Implementation
 * Replaces MDInput and Bootstrap Form.Control with a unified Tailwind-based component
 * 
 * Supports validation states: error, success
 * Supports sizes: small, medium, large
 * Supports types: text, email, password, number, tel, url, search, etc.
 */

const Input = forwardRef(({ 
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  onFocus,
  name,
  id,
  error = false,
  success = false,
  disabled = false,
  readOnly = false,
  required = false,
  size = 'medium',
  fullWidth = false,
  helperText = '',
  label = '',
  className = '',
  ...rest 
}, ref) => {
  
  // Base input classes
  const baseClasses = 'border rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500';
  
  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
  };
  
  // State classes
  let stateClasses = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  
  if (error) {
    stateClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50';
  } else if (success) {
    stateClasses = 'border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50';
  }
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Label classes
  const labelClasses = 'block text-sm font-medium text-gray-700 mb-1';
  
  // Helper text classes
  const helperTextClasses = error 
    ? 'text-sm text-red-600 mt-1' 
    : success
    ? 'text-sm text-green-600 mt-1'
    : 'text-sm text-gray-500 mt-1';
  
  // Combine all classes
  const inputClasses = [
    baseClasses,
    sizeClasses[size],
    stateClasses,
    widthClasses,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={id || name} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={inputClasses}
        aria-invalid={error}
        aria-describedby={helperText ? `${id || name}-helper-text` : undefined}
        {...rest}
      />
      
      {helperText && (
        <p id={`${id || name}-helper-text`} className={helperTextClasses}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  helperText: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default Input;

