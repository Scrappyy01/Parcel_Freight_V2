'use client';

import { forwardRef } from 'react';
import TextField from '@mui/material/TextField';

const MDInput = forwardRef(({ ...props }, ref) => {
  return <TextField ref={ref} variant="outlined" size="small" {...props} />;
});

MDInput.displayName = 'MDInput';

export default MDInput;
