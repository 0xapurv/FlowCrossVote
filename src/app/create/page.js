'use client'

import React, { useContext } from 'react';
import Navbar from "@/src/components/Navbar/Navbar";
import CreateVote from "./createVote";
import { WalletContext } from "@/src/contexts/WalletContext";

const Create = () => {
  const user = useContext(WalletContext);

  return (
    <div className="flex flex-col w-full center">
      <Navbar />
      <CreateVote />
    </div>
  );
}

export default Create;
