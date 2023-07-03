"use client"
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';

const Home = () => {
  return (
    <ChakraProvider>
      <ThirdwebProvider>
      <Navbar/>
      <Hero/>
      </ThirdwebProvider>
    
    </ChakraProvider>
   
  )
}

export default Home