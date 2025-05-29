import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'katex/dist/katex.min.css'; // Added KaTeX CSS import
// import './index.css'; // Vite's default CSS, can be cleaned up later - REMOVED
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
