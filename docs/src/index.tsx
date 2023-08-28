import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('element with id="root" not found. Please check index.html');
}
createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
