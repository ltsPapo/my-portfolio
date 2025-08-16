import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ParallaxProvider } from 'react-scroll-parallax';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ParallaxProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/spotify" element={<Navigate to="/music" replace />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ParallaxProvider>
  </React.StrictMode>
);