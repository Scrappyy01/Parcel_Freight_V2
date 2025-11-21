'use client';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card Component - Tailwind CSS Implementation
 * Replaces Bootstrap Card with a flexible Tailwind-based component
 * 
 * Features:
 * - Optional header, body, and footer sections
 * - Customizable variants: default, bordered, elevated
 * - Hover effects
 * - Flexible padding options
 */

const Card = ({ 
  children,
  header = null,
  footer = null,
  variant = 'default',
  hover = false,
  noPadding = false,
  className = '',
  ...rest 
}) => {
  
  // Base card classes
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  
  // Variant classes
  const variantClasses = {
    default: 'border border-gray-200',
    bordered: 'border-2 border-gray-300',
    elevated: 'shadow-md',
  };
  
  // Hover effect
  const hoverClasses = hover ? 'transition-shadow duration-200 hover:shadow-lg' : '';
  
  // Padding classes for body
  const bodyPaddingClasses = noPadding ? '' : 'p-6';
  
  // Combine all classes
  const cardClasses = [
    baseClasses,
    variantClasses[variant],
    hoverClasses,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={cardClasses} {...rest}>
      {/* Header */}
      {header && (
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          {header}
        </div>
      )}
      
      {/* Body */}
      <div className={bodyPaddingClasses}>
        {children}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node,
  footer: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'bordered', 'elevated']),
  hover: PropTypes.bool,
  noPadding: PropTypes.bool,
  className: PropTypes.string,
};

// Sub-components for more flexibility
Card.Header = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 px-6 py-4 bg-gray-50 ${className}`}>
    {children}
  </div>
);

Card.Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.Body = ({ children, className = '', noPadding = false }) => (
  <div className={`${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

Card.Body.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  noPadding: PropTypes.bool,
};

Card.Footer = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 px-6 py-4 bg-gray-50 ${className}`}>
    {children}
  </div>
);

Card.Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;

