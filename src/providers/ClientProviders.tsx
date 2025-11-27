'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import store from '../redux/store/store.js';
import theme from '../assets/theme/index.js';
import UserContextProvider from '../contexts/UserContext.js';
import IsDesktopContextProvider from '../contexts/IsDesktopContext.js';
import { ApplicationModeProvider } from '../contexts/ApplicationMode.js';
import { MaterialUIControllerProvider } from '../contexts/index.js';

const queryClient = new QueryClient();
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ApplicationModeProvider>
          <UserContextProvider>
            <IsDesktopContextProvider>
              <MaterialUIControllerProvider>
                <ThemeProvider theme={theme}>
                  <QueryClientProvider client={queryClient}>
                    {children}
                  </QueryClientProvider>
                </ThemeProvider>
              </MaterialUIControllerProvider>
            </IsDesktopContextProvider>
          </UserContextProvider>
        </ApplicationModeProvider>
      </GoogleOAuthProvider>
    </ReduxProvider>
  );
}
