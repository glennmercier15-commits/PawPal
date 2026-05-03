import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = document.getElementById('root');
if (root) {
  try {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    console.error('Failed to render:', error);
    root.innerHTML = `<div style="padding: 20px; font-family: sans-serif;">
      <h1 style="color: #FF9ECA;">🐾 Oops! PawPal had a little stumble</h1>
      <p>There was an error starting the app: ${error instanceof Error ? error.message : String(error)}</p>
      <p>Please try refreshing the page.</p>
    </div>`;
  }
}
