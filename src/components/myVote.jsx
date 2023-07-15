import moment from "moment/moment";
import { useState } from "react";
export default function MyVote({votationName,votationUuid,voteEnds,voteStarts,options}){
    const [selectedOption,setSelectedOptionState] = useState(null)
    const [selectedOptionIndex,setSelectedOptionIndex] = useState(null)
    const currentTimestampInMilliseconds = Date.now();
    const currentTimestampInSeconds = Math.floor(currentTimestampInMilliseconds / 1000);

    function timestampToReadableDate(timestamp) {
        const date = moment.unix(timestamp);
        return date.format('MMMM DD, YYYY, hh:mm:ss A');
    }

    function setSelectedOption(index,value){
        setSelectedOptionState(value)
        setSelectedOptionIndex(index)
    }

    function onClickVote(){

    }

    return <div>
        <div>
            <div>votation name:{votationName}</div>
            <div>start date:{timestampToReadableDate(voteEnds)}</div>
            <div>end date:{timestampToReadableDate(voteStarts)}</div>
            <div>selected option: {selectedOption}</div>
            <div>select an option clicking up it: {options.map((option,index)=><div onClick={()=>{setSelectedOption(index,option)}}>{option}</div>)}</div>
            {currentTimestampInSeconds > voteStarts & currentTimestampInSeconds < voteEnds ? <button onClick={onClickVote}>vote</button> : <button>vote unavailable</button>}
        </div>
    </div>
}