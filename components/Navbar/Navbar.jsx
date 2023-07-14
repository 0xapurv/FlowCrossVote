"use client"

import React , {useState , useEffect , useContext} from 'react'
import { Input , InputGroup  , Image, Box, Button , Heading} from '@chakra-ui/react';
import "../../flow/config";
import * as fcl from "@onflow/fcl";
import Logo from '../common/logo';
import Link from 'next/link';


// ...
const Navbar = () => {
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
    
    function AuthedState() {
        return (
          <div className='center gap-3 '>
            <div>Voter: {user?.addr ?? "No Address"}</div>
            <button className='bg-secondary px-6 py-2 text-[.9rem] hover:scale-95 transition-all duration-300' onClick={fcl.unauthenticate}>Log Out</button>
          </div>
        );
    }
    
    const UnauthenticatedState = () => {
        return (
          <div className='flex gap-3'>
            <button onClick={fcl.signUp} className='bg-secondary px-6 py-2 text-[.9rem] hover:scale-95 transition-all duration-300'>Sign Up</button>
            <button onClick={fcl.logIn} className='border border-secondary text-secondary px-6 py-2 text-[.9rem] hover:scale-95 transition-all duration-300'>Log In</button>
          </div>
        )
    }
  
    return (
        <div className="lg:w-[85%] w-[90%] between pt-6">
            <Logo />
            <div className='gap-6 font-normal tracking-wider text-normal ml-16 center'>
                <Link href="/" className='hover:text-secondary hover:scale-95 transition duration-300'>Home</Link>
                <Link href="/create" className='hover:text-secondary hover:scale-95 transition duration-300'>Create Vote</Link>
                <Link href="/vote" className='hover:text-secondary hover:scale-95 transition duration-300'>My Vote</Link>
                <Link href="/create" className='hover:text-secondary hover:scale-95 transition duration-300'>My created votes</Link>
            </div>
            <div className="">
                {user.loggedIn
                    ? <AuthedState />
                    : <UnauthenticatedState />
                }
            </div>
        </div>
    );
  };
  
  export default Navbar;
  