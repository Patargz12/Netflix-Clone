import '@mantine/core/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { MantineProvider } from '@mantine/core';
import { ThemeProvider } from '@/components/Movie/theme-provider';
import { Router } from './Router';
import { theme } from './theme';

import './index.css';

const queryClient = new QueryClient();

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
