import React from 'react';
import './globals.css'
import { WalletProvider } from '@/src/contexts/WalletContext';

export const metadata = {
  title: 'VoteChain',
  description: 'A Cross chain Voting app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black bg-center text-white poppins flex flex-col overflow-x-hidden center">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
