import React, { useEffect, useState, useContext } from 'react';
import useVotingApp from '@/src/components/useFlowVottingApp';
import { WalletContext } from '@/src/contexts/WalletContext';
const CreateVote = () => {
  const [isUserLoggedIn,setIsUserLoggedIn] = useState(false)
  const [duration, setDuration] = useState(0);
  const [daysToStart,SetDaysToStart] = useState(0);
  const [name,setName] = useState('name')
  const [options,setOptions] = useState(["burguer","pizza"])
  const [optionName,setOptionName] = useState('')
  const [accName,setAccName] = useState('')

  let user = useContext(WalletContext);
  
  const handleAccName = (e) => {
    setAccName(e.target.value)
  }
  const handleCreateVote = async () => {
    const votingApp = new useVotingApp()
    const res = await votingApp.transactionCreateVotation(name,daysToStart,daysToStart+duration,options)
    console.log(res)
  };
  const handleLogin = async () => {
    const votingApp = new useVotingApp()
    await votingApp.transactionSetUpAccount(accName)
    setIsUserLoggedIn(true)
  }

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
  


  return (<div>{user.addr == undefined ? <div>please connect your wallet</div>: <>
    { isUserLoggedIn == true ? 
    <div className="flex flex-row">
      <div className="flex flex-col">
        <h2 className="text-xl my-10">Create a Vote</h2>
        <div>
          Votation Title:
          <input className="text-black border-secondary p-5 outline-none"onChange={onChangeName} value={name}/>
        </div>
        <div className="center gap-6">
          <label htmlFor="duration" className="text-lg">
            Days from now to start votation:
          </label>
          <input
            className="text-black border-secondary p-5 outline-none"
            type="number"
            id="duration"
            value={daysToStart}
            onChange={onChangeDaysToStart}
          />
        </div>
        <div>
          Votation Duration(days):
          <input type='number' className="text-black border-secondary p-5 outline-none" value={duration} onChange={onChangeDuration}></input>
        </div>
        <div>
          Votation Options:
          {options.map(option => <div>{option}</div>)}
          <input className="text-black border-secondary p-5 outline-none" value={optionName} onChange={onChangeOptionName}></input>
          <button onClick={addOption}>Add Option Button</button>
        </div>

        {/* <h4>Candidates:</h4>
        {candidates.map((candidate, index) => (
          <div key={index} className="flex flex-col gap-4">
            <input
              className="text-black border-secondary p-5 outline-none"
              type="text"
              value={candidate}
              onChange={(e) => handleCandidateChange(index, e)}
            />
            <button onClick={() => handleRemoveCandidate(index)}>Remove</button>
          </div>
        ))} */}
        {/* <button onClick={handleAddCandidate}>Add Candidate</button> */}

        <button onClick={handleCreateVote}>Create Vote Button</button>
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
    </div> : <div><div>account name:<input className="text-black border-secondary p-5 outline-none" value={accName} onChange={handleAccName}></input></div><div onClick={handleLogin}>clickto login</div></div>}</>}</div>
  ); 
};

export default CreateVote;