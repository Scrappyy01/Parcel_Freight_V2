'use client';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Spinner Component - Tailwind CSS Implementation
 * Replaces Bootstrap Spinner with a flexible Tailwind-based loading spinner
 * 
 * Features:
 * - Multiple sizes: small, medium, large
 * - Color options matching the design system
 * - Multiple variants: border (default), grow
 * - Optional text label
 */

const Spinner = ({ 
  size = 'medium',
  color = 'primary',
  variant = 'border',
  label = '',
  className = '',
  ...rest 
}) => {
  
  // Size classes
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };
  
  // Color classes
  const colorClasses = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    info: 'border-cyan-600',
    success: 'border-green-600',
    warning: 'border-yellow-500',
    error: 'border-red-600',
    light: 'border-gray-300',
    dark: 'border-gray-900',
    white: 'border-white',
  };
  
  // Border spinner (default)
  if (variant === 'border') {
    const spinnerClasses = [
      'inline-block',
      'animate-spin',
      'rounded-full',
      'border-4',
      'border-solid',
      'border-t-transparent',
      colorClasses[color] || colorClasses.primary,
      sizeClasses[size],
      className,
    ].filter(Boolean).join(' ');
    
    return (
      <div className="inline-flex items-center gap-2">
        <div 
          className={spinnerClasses}
          role="status"
          aria-label={label || 'Loading'}
          {...rest}
        >
          <span className="sr-only">{label || 'Loading...'}</span>
        </div>
        {label && (
          <span className="text-sm text-gray-600">{label}</span>
        )}
      </div>
    );
  }
  
  // Grow spinner (pulsing dots)
  if (variant === 'grow') {
    const dotSizeClasses = {
      small: 'h-2 w-2',
      medium: 'h-3 w-3',
      large: 'h-4 w-4',
    };
    
    const dotColorClasses = {
      primary: 'bg-blue-600',
      secondary: 'bg-gray-600',
      info: 'bg-cyan-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-500',
      error: 'bg-red-600',
      light: 'bg-gray-300',
      dark: 'bg-gray-900',
      white: 'bg-white',
    };
    
    const dotClasses = [
      'rounded-full',
      'animate-pulse',
      dotColorClasses[color] || dotColorClasses.primary,
      dotSizeClasses[size],
    ].filter(Boolean).join(' ');
    
    return (
      <div className={`inline-flex items-center gap-2 ${className}`} {...rest}>
        <div className="flex gap-1" role="status" aria-label={label || 'Loading'}>
          <div className={dotClasses} style={{ animationDelay: '0ms' }}></div>
          <div className={dotClasses} style={{ animationDelay: '150ms' }}></div>
          <div className={dotClasses} style={{ animationDelay: '300ms' }}></div>
          <span className="sr-only">{label || 'Loading...'}</span>
        </div>
        {label && (
          <span className="text-sm text-gray-600">{label}</span>
        )}
      </div>
    );
  }
  
  return null;
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
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
  variant: PropTypes.oneOf(['border', 'grow']),
  label: PropTypes.string,
  className: PropTypes.string,
};

export default Spinner;

