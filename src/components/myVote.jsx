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
            setErrorMessage('please select an option to vote')
            return
        }
        const votingApp = new useVotingApp()
        const data = await votingApp.transactionVote(votationUuid,selectedOptionIndex)
        setSuccefulMessage('Ur vote has been added succefully')
    }

    return <div>
        <div>
            <div>votation name:{votationName}</div>
            <div>start date:{timestampToReadableDate(voteEnds)}</div>
            <div>end date:{timestampToReadableDate(voteStarts)}</div>
            <div>selected option: {selectedOption}</div>
            <div>select an option clicking up it: {options.map((option,index)=><div onClick={()=>{setSelectedOption(index,option)}}>{option}</div>)}</div>
            {currentTimestampInSeconds > voteStarts & currentTimestampInSeconds < voteEnds ? <button onClick={onClickVote}>vote</button> : <button onClick={onClickVote}>voteation has ended or started</button>}
            {errorMessage.length > 0 ? <div>error message:{errorMessage}</div> : <div></div>}
            {succefulMessage.length >0 ? <div>succefull message:{succefulMessage}</div> : <div></div>}
        </div>
    </div>
}