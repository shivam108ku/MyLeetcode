import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router'; // Correct import
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 
import queryClient from './Utils/queryClient.js';
import './index.css';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(

  <StrictMode>

    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>

  </StrictMode>

);