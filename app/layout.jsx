'use client';

import { Inter } from 'next/font/google';
import 'katex/dist/katex.min.css';
import App from '../src/App';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
  adjustFontFallback: false,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>BTR Risk Model</title>
        <meta
          name="description"
          content="BTR Risk is a defines, simulates and help visualize the risks of the protocol given variable risk parameters."
        />
        <meta
          name="keywords"
          content="BTR Supply, BTR Markets, financial risk, modeling, allocation, liquidity, slippage, optimization"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
      </head>
      <body>
        <App>{children}</App>
      </body>
    </html>
  );
}
