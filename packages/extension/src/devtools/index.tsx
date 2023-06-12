/**
 * External dependencies.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies.
 */
import App from './app';
import { Provider as ExternalStoreProvider } from '../app/cookieStore';

createRoot(document.getElementById('root')).render(
  <ExternalStoreProvider>
    <App />
  </ExternalStoreProvider>
);
