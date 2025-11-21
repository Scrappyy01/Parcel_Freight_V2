'use client';

import { forwardRef } from 'react';
import Typography from '@mui/material/Typography';

const MDTypography = forwardRef(({ ...props }, ref) => {
  return <Typography ref={ref} {...props} />;
});

MDTypography.displayName = 'MDTypography';

export default MDTypography;
