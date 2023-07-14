'use client'

import React, { createContext, useEffect, useState } from 'react';
import * as fcl from "@onflow/fcl";
import "../../flow/config";

export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: null });

  useEffect(() => {
    const subscription = fcl.currentUser.subscribe((userData) => {
      setUser(userData);
      console.log(userData);
    });

    return () => {
      subscription();
    };
  }, []);

  return (
    <WalletContext.Provider value={user}>
      {children}
    </WalletContext.Provider>
  );
};
