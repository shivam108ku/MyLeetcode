// src/lib/queryClient.js
import { QueryClient } from '@tanstack/react-query';

 const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Disable for dev
    },
  },
});

export default queryClient;
