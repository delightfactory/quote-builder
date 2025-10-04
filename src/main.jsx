import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { registerServiceWorker, setupInstallPrompt } from './utils/registerServiceWorker';

// Render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register Service Worker for PWA functionality
registerServiceWorker();

// Setup PWA install prompt
setupInstallPrompt();
