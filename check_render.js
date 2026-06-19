import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { HelmetProvider } from 'react-helmet-async';
import App from './src/App.jsx';

try {
  const html = renderToString(
    <HelmetProvider>
      <StaticRouter location="/admin">
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
  console.log('Rendered successfully. No immediate crash.');
} catch (e) {
  console.error('CRASH DURING RENDER:', e);
}
