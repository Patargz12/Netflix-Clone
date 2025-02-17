import '@mantine/core/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { MantineProvider } from '@mantine/core';
import { ThemeProvider } from '@/components/Movie/theme-provider';
import { Router } from './Router';
import { theme } from './theme';

import './index.css';

/**
 * Create a new QueryClient instance
 * This manages all the query and mutation caching for the application
 */
const queryClient = new QueryClient();

/**
 * Render the application with necessary providers:
 *
 * 1. StrictMode - Enables additional checks and warnings
 * 2. BrowserRouter - Enables routing functionality
 * 3. QueryClientProvider - Provides React Query context
 * 4. Toaster - Enables toast notifications
 */

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" forcedTheme="dark">
        <MantineProvider theme={theme}>
          <Router />
          <Toaster position="top-right" />
        </MantineProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
