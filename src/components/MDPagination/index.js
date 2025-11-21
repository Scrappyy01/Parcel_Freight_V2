'use client';

import { forwardRef } from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

const MDPagination = forwardRef(({ children, ...props }, ref) => {
  return (
    <Pagination 
      ref={ref} 
      {...props}
      renderItem={(item) => (
        <PaginationItem {...item} />
      )}
    >
      {children}
    </Pagination>
  );
});

MDPagination.displayName = 'MDPagination';

export default MDPagination;
