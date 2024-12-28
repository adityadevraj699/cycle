import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';  // Ensure this CSS file exists
import App from './App.jsx';  // Ensure App.jsx exists in the root directory

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
