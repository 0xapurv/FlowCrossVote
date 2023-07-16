'use client'

import React, { useEffect, useState, useContext } from 'react';
import useVotingApp from '@/src/components/useFlowVottingApp';
import { WalletContext } from '@/src/contexts/WalletContext';
import CustomButton from '@/src/components/common/button';
import RestrictedToLogin from '@/src/components/RestrictedToLogin';

const CreateVote = () => {
  const [isUserLoggedIn,setIsUserLoggedIn] = useState(false)
  const [duration, setDuration] = useState(0);
  const [daysToStart,SetDaysToStart] = useState(0);
  const [name,setName] = useState('name')
  const [options,setOptions] = useState([])
  const [optionName,setOptionName] = useState('')

  let user = useContext(WalletContext);
  
  
  const handleCreateVote = async () => {
    const votingApp = new useVotingApp()
    const res = await votingApp.transactionCreateVotation(name,daysToStart,daysToStart+duration,options)
    console.log(res)
  };
  

  const onChangeDuration = (e) => {
    setDuration(e.target.value);

  }

  const onChangeName = (e) => {
    console.log(e.target.value)
    setName(e.target.value)
  }

  const onChangeDaysToStart = (e) => {
    SetDaysToStart(e.target.value)
  }

  const addOption = () => {
    setOptions([...options,optionName])
    setOptionName("")
  }



  const onChangeOptionName = (e) => {
    setOptionName(e.target.value)
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
  
  const content =
    <div className="flex flex-row w-screen center">
      <div className="flex flex-col gap-10 w-[85%] pb-20">
        <h2 className="text-lg mt-16 bespoke">Create a Vote</h2>
        <div className='flex flex-col gap-2 items-start'>
          <label htmlFor="title">Vote Title:</label>
          <input className="text-black outline-secondary py-2 pl-4 w-3/5" onChange={onChangeName} value={name} id='title'/>
        </div>
        <div className="flex gap-2 items-start flex-col">
          <label htmlFor="duration">
            Days from now to start voting:
          </label>
          <input
            className="text-black outline-secondary py-3 pl-4 w-3/5"
            type="number"
            id="duration"
            value={daysToStart}
            onChange={onChangeDaysToStart}
          />
        </div>
        <div className="flex gap-2 items-start flex-col">
          <label htmlFor="duration">
            Votation Duration(days):
          </label>
          <input type='number' id='duration'  className="text-black w-3/5 outline-secondary py-3 pl-4" placeholder='Enter vote duration' value={duration} onChange={onChangeDuration}></input>
        </div>
        <div className="flex gap-2 items-start flex-col w-3/5">
          <div className='between w-full'>
            <label htmlFor="option">
              Voting Options:
            </label>
            <button className='p-3 text-sm bg-secondary hover:scale-95 transition-all duration-300' onClick={addOption}>Add Options</button>
          </div>
          {options.map(option => <div>{option}</div>)}
          <input className="text-black outline-secondary w-full py-3 pl-4 " placeholder="Enter an option" value={optionName} onChange={onChangeOptionName}></input>
          
        </div>

        {/* <h4>Candidates:</h4>
        {candidates.map((candidate, index) => (
          <div key={index} className="flex flex-col gap-4">
            <input
              className="text-black border-secondary p-5 o6utline-none"
              type="text"
              value={candidate}
              onChange={(e) => handleCandidateChange(index, e)}
            />
            <button onClick={() => handleRemoveCandidate(index)}>Remove</button>
          </div>
        ))} */}
        {/* <button onClick={handleAddCandidate}>Add Candidate</button> */}
        <CustomButton textSize='1.2rem' border='1px solid #A6245A' padding='15px 30px' background='#A6245A' borderRadius='0' textColor='#FFF' onClick={handleCreateVote}>Create Vote</CustomButton>
      </div>

      {/* <div className="ml-8">
        <h4>Vote Table:</h4>
        <table className="border-collapse border border-gray-500">
          <thead>
            <tr>
              <th className="border border-gray-500 p-2">Candidate</th>
              <th className="border border-gray-500 p-2">Votes</th>
            </tr>
          </thead>
          <tbody>
            {voteTable.map((vote, index) => (
              <tr key={index}>
                <td className="border border-gray-500 p-2">{vote.candidate}</td>
                <td className="border border-gray-500 p-2">{vote.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>

  return <RestrictedToLogin >{content}</RestrictedToLogin>; 
};

export default CreateVote;