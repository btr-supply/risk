'use client';

import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import App from '../src/App';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const stixTwoMath = localFont({
  src: '../public/fonts/STIXTwoMath-Regular.woff2',
  display: 'swap',
  variable: '--font-stix-two-math',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${stixTwoMath.variable}`}>
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
        <style jsx global>{`
          html,
          body {
            height: auto !important;
            min-height: 100vh;
            overflow-x: hidden;
            scroll-behavior: smooth;
          }

          /* Ensure proper height calculation for each page */
          #__next {
            height: auto !important;
            min-height: 100vh;
          }

          /* Reset scroll behavior on route changes */
          [data-nextjs-scroll-focus-boundary] {
            height: auto !important;
          }
        `}</style>
      </head>
      <body>
        <App>{children}</App>
      </body>
    </html>
  );
}
