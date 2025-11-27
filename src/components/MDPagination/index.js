'use client';

import { forwardRef } from 'react';
import { styled } from '@mui/material/styles';
import MuiPagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

// Custom styled pagination button for when used as an item
const StyledPaginationItem = styled('button')(({ theme, active, variant, color }) => {
  const colorValue = theme.palette[color]?.main || theme.palette.info.main;
  
  return {
    minWidth: '36px',
    height: '36px',
    margin: '0 2px',
    padding: '0 6px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: active ? 'bold' : 'normal',
    transition: 'all 0.15s ease',
    backgroundColor: active ? colorValue : 'transparent',
    color: active ? '#fff' : theme.palette.text.primary,
    '&:hover': {
      backgroundColor: active ? colorValue : theme.palette.action.hover,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  };
});

const MDPagination = forwardRef(({ 
  item, 
  active, 
  children, 
  variant = "gradient", 
  color = "info",
  onClick,
  ...props 
}, ref) => {
  // If used as an item (button), render a styled button
  if (item) {
    return (
      <StyledPaginationItem
        ref={ref}
        active={active}
        variant={variant}
        color={color}
        onClick={onClick}
        {...props}
      >
        {children}
      </StyledPaginationItem>
    );
  }

  // Otherwise render as a container (flexbox wrapper)
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        padding: '8px 0',
      }}
      {...props}
    >
      {children}
    </div>
  );
});

MDPagination.displayName = 'MDPagination';

export default MDPagination;
