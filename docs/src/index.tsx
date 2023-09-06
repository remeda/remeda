import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import invariant from 'tiny-invariant';

const ROOT_ELEMENT_ID = 'root';

const rootElement = document.getElementById(ROOT_ELEMENT_ID);
invariant(
  rootElement !== null,
  `element with id=${ROOT_ELEMENT_ID} not found. Please check index.html`,
);

const reactRoot = createRoot(rootElement);
reactRoot.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
