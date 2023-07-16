import moment from "moment/moment";
import { useState,useContext } from "react";
import useVotingApp from '@/src/components/useFlowVottingApp';
import { WalletContext } from '@/src/contexts/WalletContext';
export default function MyVote({votationName,votationUuid,voteEnds,voteStarts,options}){
    const [selectedOption,setSelectedOptionState] = useState(null)
    const [selectedOptionIndex,setSelectedOptionIndex] = useState(null)
    const [errorMessage,setErrorMessage] = useState('')
    const [succefulMessage,setSuccefulMessage] = useState('')
    const currentTimestampInMilliseconds = Date.now();
    const currentTimestampInSeconds = Math.floor(currentTimestampInMilliseconds / 1000);
    let user = useContext(WalletContext);

    function timestampToReadableDate(timestamp) {
        const date = moment.unix(timestamp);
        return date.format('MMMM DD, YYYY, hh:mm:ss A');
    }

    function setSelectedOption(index,value){
        setSelectedOptionState(value)
        setSelectedOptionIndex(index)
    }

    async function onClickVote(){
        if(user.addr==undefined){
            return
        }
        if(selectedOptionIndex==null){
            setErrorMessage('Please select an option to vote')
            return
        }
        const votingApp = new useVotingApp()
        const data = await votingApp.transactionVote(votationUuid,selectedOptionIndex)
        setSuccefulMessage('Your vote has been added successfully')
    }

    return <div className="w-screen center min-h-screen">
        <div className="w-[85%] h-full flex flex-col gap-10">
            <div className="flex gap-3"><p className="font-bold text-secondary capitalize">votation name: </p>{votationName}</div>
            <div className="flex gap-3"><p className="font-bold text-secondary capitalize">start date: </p>{timestampToReadableDate(voteEnds)}</div>
            <div className="flex gap-3"><p className="font-bold text-secondary capitalize">end date: </p> {timestampToReadableDate(voteStarts)}</div>
            <div className="flex gap-3"><p className="font-bold text-secondary capitalize">selected option: </p>{selectedOption}</div>
            <div className="flex items-center justify-start gap-3"><p className="font-bold text-secondary capitalize">select an option by clicking on it: </p>{options.map((option,index)=><div className="flex flex-col gap-6" onClick={()=>{setSelectedOption(index,option)}}><button className='bg-secondary px-6 py-2 text-[.9rem] hover:scale-95 transition-all duration-300'>{option}</button></div>)}</div>
            {currentTimestampInSeconds > voteStarts & currentTimestampInSeconds < voteEnds ? <button onClick={onClickVote}>vote</button> : <button className='bg-secondary px-6 py-3 text-[.9rem] hover:scale-95 transition-all duration-300' onClick={onClickVote}>Vote</button>}
            {errorMessage.length > 0 ? <div>{errorMessage}</div> : <div></div>}
            {succefulMessage.length >0 ? <div>{succefulMessage}</div> : <div></div>}
        </div>
    </div>
}