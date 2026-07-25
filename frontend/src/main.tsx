/**
 * StockLuhh - Smart Inventory Tracker
 * Application Entry Point
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA
registerSW({
    onNeedRefresh() {
        console.log('New content available');
    },
    onOfflineReady() {
        console.log('App ready for offline usage');
    },
});

// Mount the app
const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>
);

