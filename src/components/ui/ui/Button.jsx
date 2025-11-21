'use client';

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Button Component - Tailwind CSS Implementation
 * Replaces MDButton and Bootstrap Button with a unified Tailwind-based component
 * 
 * Supports variants: text, contained, outlined, gradient
 * Supports colors: primary, secondary, info, success, warning, error, light, dark, white
 * Supports sizes: small, medium, large
 */

const Button = forwardRef(({ 
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  circular = false,
  iconOnly = false,
  className = '',
  onClick,
  type = 'button',
  ...rest 
}, ref) => {
  
  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size classes
  const sizeClasses = {
    small: iconOnly ? 'p-2' : 'px-3 py-1.5 text-sm',
    medium: iconOnly ? 'p-2.5' : 'px-4 py-2 text-base',
    large: iconOnly ? 'p-3' : 'px-6 py-3 text-lg',
  };
  
  // Shape classes
  const shapeClasses = circular || iconOnly 
    ? 'rounded-full' 
    : 'rounded-md';
  
  // Color and variant combinations
  const variantColorClasses = {
    contained: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm hover:shadow-md',
      info: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 shadow-sm hover:shadow-md',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-sm hover:shadow-md',
      error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md',
      dark: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700 shadow-sm hover:shadow-md',
      light: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300 shadow-sm hover:shadow-md',
      white: 'bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-300 shadow-sm hover:shadow-md border border-gray-300',
    },
    outlined: {
      primary: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      secondary: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
      info: 'border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 focus:ring-cyan-500',
      success: 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
      warning: 'border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
      error: 'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
      dark: 'border-2 border-gray-900 text-gray-900 hover:bg-gray-50 focus:ring-gray-700',
      light: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
      white: 'border-2 border-white text-white hover:bg-white/10 focus:ring-white',
    },
    text: {
      primary: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      secondary: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
      info: 'text-cyan-600 hover:bg-cyan-50 focus:ring-cyan-500',
      success: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
      warning: 'text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
      error: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
      dark: 'text-gray-900 hover:bg-gray-50 focus:ring-gray-700',
      light: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-300',
      white: 'text-white hover:bg-white/10 focus:ring-white',
    },
    gradient: {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-md hover:shadow-lg',
      secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500 shadow-md hover:shadow-lg',
      info: 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white hover:from-cyan-700 hover:to-cyan-800 focus:ring-cyan-500 shadow-md hover:shadow-lg',
      success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500 shadow-md hover:shadow-lg',
      warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 focus:ring-yellow-500 shadow-md hover:shadow-lg',
      error: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-md hover:shadow-lg',
      dark: 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 focus:ring-gray-700 shadow-md hover:shadow-lg',
      light: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-300 shadow-md hover:shadow-lg',
      white: 'bg-gradient-to-r from-white to-gray-50 text-gray-900 hover:from-gray-50 hover:to-gray-100 focus:ring-gray-300 shadow-md hover:shadow-lg border border-gray-300',
    },
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    shapeClasses,
    variantColorClasses[variant]?.[color] || variantColorClasses.contained.primary,
    widthClasses,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['text', 'contained', 'outlined', 'gradient']),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
    'white',
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;

