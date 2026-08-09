import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './app/App.jsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@shared/api/query-client';

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <App />
    </StrictMode>
  </QueryClientProvider>,
);
