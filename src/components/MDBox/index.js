'use client';

import { forwardRef } from 'react';
import Box from '@mui/material/Box';

const MDBox = forwardRef(({ ...props }, ref) => {
  return <Box ref={ref} {...props} />;
});

MDBox.displayName = 'MDBox';

export default MDBox;
