import '@fontsource-variable/geologica';
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource-variable/spline-sans-mono';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from '@/app/router';
import '@/styles/tokens.css';
import '@/styles/global.css';
import '@/styles/app.css';
import '@/styles/dashboard.css';
import '@/styles/management.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);
