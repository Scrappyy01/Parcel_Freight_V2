'use client';

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Typography Component - Tailwind CSS Implementation
 * Replaces MDTypography with a flexible Tailwind-based text component
 * 
 * Supports:
 * - Multiple variants: h1, h2, h3, h4, h5, h6, body1, body2, caption, overline
 * - Color options matching MDTypography
 * - Font weights: light, regular, medium, bold
 * - Text transformations: none, capitalize, uppercase, lowercase
 * - Text alignment
 * - Gradient text support
 */

const Typography = forwardRef(({ 
  variant = 'body1',
  component,
  color = 'dark',
  fontWeight = 'regular',
  textTransform = 'none',
  align = 'left',
  textGradient = false,
  opacity = 1,
  gutterBottom = false,
  noWrap = false,
  children,
  className = '',
  ...rest 
}, ref) => {
  
  // Determine HTML element to use
  const Component = component || {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    body1: 'p',
    body2: 'p',
    caption: 'span',
    overline: 'span',
  }[variant] || 'p';
  
  // Variant typography classes
  const variantClasses = {
    h1: 'text-5xl font-bold leading-tight',
    h2: 'text-4xl font-bold leading-tight',
    h3: 'text-3xl font-semibold leading-snug',
    h4: 'text-2xl font-semibold leading-snug',
    h5: 'text-xl font-medium leading-normal',
    h6: 'text-lg font-medium leading-normal',
    body1: 'text-base leading-relaxed',
    body2: 'text-sm leading-relaxed',
    caption: 'text-xs leading-normal',
    overline: 'text-xs uppercase tracking-wider leading-normal',
  };
  
  // Color classes
  const colorClasses = {
    inherit: 'text-inherit',
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    info: 'text-cyan-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    light: 'text-gray-300',
    dark: 'text-gray-900',
    text: 'text-gray-700',
    white: 'text-white',
  };
  
  // Font weight classes
  const fontWeightClasses = {
    light: 'font-light',
    regular: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
  };
  
  // Text transform classes
  const textTransformClasses = {
    none: '',
    capitalize: 'capitalize',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
  };
  
  // Text alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };
  
  // Additional utility classes
  const gutterBottomClass = gutterBottom ? 'mb-4' : '';
  const noWrapClass = noWrap ? 'whitespace-nowrap overflow-hidden text-ellipsis' : '';
  
  // Gradient text classes
  const gradientClasses = textGradient 
    ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
    : '';
  
  // Combine all classes
  const typographyClasses = [
    variantClasses[variant],
    !textGradient && colorClasses[color],
    fontWeightClasses[fontWeight],
    textTransformClasses[textTransform],
    alignClasses[align],
    gutterBottomClass,
    noWrapClass,
    gradientClasses,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <Component
      ref={ref}
      className={typographyClasses}
      style={{ opacity }}
      {...rest}
    >
      {children}
    </Component>
  );
});

Typography.displayName = 'Typography';

Typography.propTypes = {
  variant: PropTypes.oneOf([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'body1',
    'body2',
    'caption',
    'overline',
  ]),
  component: PropTypes.elementType,
  color: PropTypes.oneOf([
    'inherit',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
    'text',
    'white',
  ]),
  fontWeight: PropTypes.oneOf(['light', 'regular', 'medium', 'bold']),
  textTransform: PropTypes.oneOf(['none', 'capitalize', 'uppercase', 'lowercase']),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  textGradient: PropTypes.bool,
  opacity: PropTypes.number,
  gutterBottom: PropTypes.bool,
  noWrap: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Typography;

