'use client'
import moment from "moment/moment";
import Navbar from "@/src/components/Navbar/Navbar";
import useVotingApp from "@/src/components/useFlowVottingApp";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import Loading from "../../loading";

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
        {loading ? <Loading /> : 
        <div className="w-[85%] min-h-[90vh] flex justify-center flex-col gap-6"> 
            <div className="flex gap-3"><p className="font-bold text-secondary capitalize">votation name:</p> {votationData.votationName}</div> 
            <div className="flex gap-3"><p className="font-bold text-secondary capitalize">amount candidates:</p> {votationData.amountCandidates}</div> 
            <div className="flex gap-3"><p className="font-bold text-secondary capitalize">amount candidate has voted:</p> {votationData.usedVotes}</div> 
            <div className="flex gap-3"><p className="font-bold text-secondary capitalize">votation start date:</p>{timestampToReadableDate(votationData.voteStarts)} </div>
            <div className="flex gap-3"><p className="font-bold text-secondary capitalize">votation end date: </p>{timestampToReadableDate(votationData.voteEnds)} </div>
            <div>{votationData.options.map((option,index)=><div className="flex gap-3 capitalize"><p className="font-bold text-secondary">option: </p> {option} | number of votes : {votationData.optionsAmountVotes[index]}</div>)}</div>
 
        </div>}
    </div>
}