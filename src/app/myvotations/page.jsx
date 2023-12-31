'use client'

import Navbar from "@/src/components/Navbar/Navbar"
import RestrictedToLogin from "@/src/components/RestrictedToLogin"
import { useState,useContext } from "react"
import { WalletContext } from '@/src/contexts/WalletContext';
import useVotingApp from "@/src/components/useFlowVottingApp";
import MyVotation from "@/src/components/myVotation";

export default function myvotations(){
    const [voatations,setVotations] = useState([])
    let user = useContext(WalletContext);
    console.log(voatations)
    async function getVotations (){
        if(voatations.length>0){
            return 
        }
        if(user.addr==undefined){
            return
        }
        const votingApp = new useVotingApp()
        const data = await votingApp.scriptGetMyCreatedVotations(user.addr)
        console.log("votations",data)
        setVotations([...data.data])
    }
    getVotations()
    const content = voatations.map(votation=><MyVotation name={votation.name} uuid={votation.uuid}/>)
    return <div className="w-screen flex-col center">
            <Navbar/>
            <RestrictedToLogin>
                {content}
            </RestrictedToLogin>
        </div>
}