'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@/redux/store/store';
import ThemeRegistry from '@/app/theme-registry';

const queryClient = new QueryClient();
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ThemeRegistry>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ThemeRegistry>
      </GoogleOAuthProvider>
    </ReduxProvider>
  );
}
