"use client"
import React , {useState , useEffect , useContext} from 'react'
import { Input , InputGroup  , Image, Box, Button , Heading} from '@chakra-ui/react';

import { ConnectWallet } from '@thirdweb-dev/react';


const Navbar = () => {
    
    // usestate
    const [openToolBox  , setopenToolBox] = useState(false)

    // handlebutton
    const handlebutton = () => {}

  return (
    <>

    <div  className='p-6' style={{backgroundColor:'#393E46'}} >
        <div className='flex justify-between flex-column flex-wrap'>
            <div className='flex justify-around gap-6 flex-column flex-wrap'> 
                <div className='gap-2'>
                    <Heading className='text-2xl' style={{color:'#7895CB'}}>
                   IVote
                        </Heading>
                </div>
            </div>

            <div>
                <Heading className='text-2xl' style={{color:'#7895CB'}}>Cross Chain Voting App</Heading>
            </div>
            <div className='flex justify-around gap-6 flex-column flex-wrap ' style={{justifyContent:'center' , alignContent:'center' }} >
             {/* // connect wallet button */}
                <div>
             <ConnectWallet/>
             </div>
            
            </div>
            
        </div>
    </div>

    </>
  )
}

export default Navbar