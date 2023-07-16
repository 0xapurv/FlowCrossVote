import React, { useEffect, useState, useContext } from 'react';
import useVotingApp from '@/src/components/useFlowVottingApp';
import { WalletContext } from '@/src/contexts/WalletContext';

export default function RestrictedToLogin({children}){
    const [isUserLoggedIn,setIsUserLoggedIn] = useState(false)
    let user = useContext(WalletContext);
    const [accName,setAccName] = useState('')
    const handleLogin = async () => {
        const votingApp = new useVotingApp()
        await votingApp.transactionSetUpAccount(accName)
        setIsUserLoggedIn(true)
      }
    const handleAccName = (e) => {
        setAccName(e.target.value)
      }

    async function isLoggedIn(){
        if(user.addr==undefined){
          return
        }
        if(isUserLoggedIn==true){
          return
        }
        console.log('is logged in',isUserLoggedIn)
        const votingApp = new useVotingApp()
        const data = await votingApp.scriptIsUserSignedUp(user.addr)
        setIsUserLoggedIn(data.data)
      }
      
      isLoggedIn()
      console.log(user.addr)
      return (
        <div>
          {user.addr === undefined || user.addr === null ? (
            <div className="w-screen h-[90vh] center">please connect your wallet</div>
          ) : (
            <>
              {isUserLoggedIn ? (
                children
              ) : (
                <div className="h-[90vh] gap-8 center flex-col">
                  <div>account name:</div>
                  <input
                    className="text-black border-secondary p-5 outline-none"
                    value={accName}
                    onChange={handleAccName}
                  />
                  <button className='bg-secondary px-6 py-2 text-[.9rem] hover:scale-95 transition-all duration-300' onClick={handleLogin}>click to login</button>
                </div>
              )}
            </>
          )}
        </div>
      );
      
}