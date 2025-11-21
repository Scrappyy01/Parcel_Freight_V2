'use client';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge Component - Tailwind CSS Implementation
 * Replaces MDBadge with a flexible Tailwind-based badge component
 * 
 * Features:
 * - Multiple variants: solid, outline, dot
 * - Color options: primary, secondary, info, success, warning, error, light, dark
 * - Size options: small, medium, large
 * - Circular or pill-shaped
 */

const Badge = ({ 
  children,
  variant = 'solid',
  color = 'primary',
  size = 'medium',
  circular = false,
  dot = false,
  className = '',
  ...rest 
}) => {
  
  // Base badge classes
  const baseClasses = 'inline-flex items-center justify-center font-medium';
  
  // Size classes
  const sizeClasses = {
    small: dot ? 'h-2 w-2' : 'px-2 py-0.5 text-xs',
    medium: dot ? 'h-2.5 w-2.5' : 'px-2.5 py-1 text-sm',
    large: dot ? 'h-3 w-3' : 'px-3 py-1.5 text-base',
  };
  
  // Shape classes
  const shapeClasses = circular || dot ? 'rounded-full' : 'rounded-md';
  
  // Variant and color combinations
  const variantColorClasses = {
    solid: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-600 text-white',
      info: 'bg-cyan-600 text-white',
      success: 'bg-green-600 text-white',
      warning: 'bg-yellow-500 text-white',
      error: 'bg-red-600 text-white',
      light: 'bg-gray-200 text-gray-800',
      dark: 'bg-gray-900 text-white',
    },
    outline: {
      primary: 'border border-blue-600 text-blue-600 bg-transparent',
      secondary: 'border border-gray-600 text-gray-600 bg-transparent',
      info: 'border border-cyan-600 text-cyan-600 bg-transparent',
      success: 'border border-green-600 text-green-600 bg-transparent',
      warning: 'border border-yellow-500 text-yellow-600 bg-transparent',
      error: 'border border-red-600 text-red-600 bg-transparent',
      light: 'border border-gray-300 text-gray-600 bg-transparent',
      dark: 'border border-gray-900 text-gray-900 bg-transparent',
    },
    dot: {
      primary: 'bg-blue-600',
      secondary: 'bg-gray-600',
      info: 'bg-cyan-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-500',
      error: 'bg-red-600',
      light: 'bg-gray-300',
      dark: 'bg-gray-900',
    },
  };
  
  // Use dot variant if dot prop is true
  const effectiveVariant = dot ? 'dot' : variant;
  
  // Combine all classes
  const badgeClasses = [
    baseClasses,
    sizeClasses[size],
    shapeClasses,
    variantColorClasses[effectiveVariant]?.[color] || variantColorClasses.solid.primary,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <span className={badgeClasses} {...rest}>
      {!dot && children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['solid', 'outline', 'dot']),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  circular: PropTypes.bool,
  dot: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;

