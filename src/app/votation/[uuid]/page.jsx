'use client'
import moment from "moment/moment";
import Navbar from "@/src/components/Navbar/Navbar";
import useVotingApp from "@/src/components/useFlowVottingApp";
import { useState } from "react";
import { usePathname } from 'next/navigation';

export default function Votation(){
    const pathname = usePathname()
    const [votationData,setVotationData] = useState({
            amountCandidates:0,
            options:[],
            optionsAmountVotes:[],
            usedVotes:0,
            votationName:'',
            voteEnds:"",
            voteStarts:""
    })
    const [loading,setLoading] = useState(true)
    const parsedPathName = pathname.split('/')[2]
    const uuid = parsedPathName.split('owner')[0]
    const owner = parsedPathName.split('owner')[1]
    async function getVotationData(){
        if(loading==false){
            return
        }
        const votingApp = new useVotingApp()
        const votationdata = await votingApp.scriptGetVotationData(uuid,owner)
        const voteStarts = votationdata.data.voteEnds.split(".")[0]
        const voteEnds = votationdata.data.voteEnds.split(".")[0]
        setVotationData({...votationdata.data,voteStarts:voteStarts,voteEnds:voteEnds})
        setLoading(false)
    }
    function timestampToReadableDate(timestamp) {
        const date = moment.unix(timestamp);
        return date.format('MMMM DD, YYYY, hh:mm:ss A');
    }
    getVotationData()
    console.log(votationData)
    return <div className="flex flex-col w-full center">
        <Navbar />
        {loading ? <div>loading</div> : 
        <div> 
            <div>votation name: {votationData.votationName}</div> 
            <div>amount candidates: {votationData.amountCandidates}</div> 
            <div>amount candidate has voted: {votationData.usedVotes}</div> 
            <div>votation start end date:{timestampToReadableDate(votationData.voteStarts)} </div>
            <div>votation end date:{timestampToReadableDate(votationData.voteEnds)} </div>
            <div>{votationData.options.map((option,index)=><div>option : {option} | amount votes : {votationData.optionsAmountVotes[index]}</div>)}</div>

        </div>}
    </div>
}