import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppwriteProvider } from '@appwrite.io/react';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppwriteProvider
      endpoint={import.meta.env.VITE_APPWRITE_ENDPOINT}
      projectId={import.meta.env.VITE_APPWRITE_PROJECT_ID}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppwriteProvider>
  </StrictMode>
);
