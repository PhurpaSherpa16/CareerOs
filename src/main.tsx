import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
import { ClerkProvider } from '@clerk/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      signInUrl="/login" 
      signUpUrl="/register" 
      signInFallbackRedirectUrl="/user-dashboard" 
      signUpFallbackRedirectUrl="/user-dashboard">
        <App />
      </ClerkProvider>
    </QueryClientProvider>
  </StrictMode>,
)
