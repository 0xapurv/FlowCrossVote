'use client'

import Navbar from "@/src/components/Navbar/Navbar";
import RestrictedToLogin from "@/src/components/RestrictedToLogin";
import useVotingApp from "@/src/components/useFlowVottingApp";
import { useState,useContext } from "react";
import { WalletContext } from '@/src/contexts/WalletContext';
import MyVote from "@/src/components/myVote";

export default function vote(){
    const [votes,setVotes] = useState([]);
    const [fetching,setFetching] = useState(true);
    let user = useContext(WalletContext);

    async function getVotes (){
        if(votes.length>0){
            return 
        }
        if(user.addr==undefined){
            return
        }
        if(fetching==false){
            return 
        }
        const votingApp = new useVotingApp()
        const data = await votingApp.scriptGetUserAvailablesVotes(user.addr)
        setVotes([...data.data])
        setFetching(false)
    }
    getVotes()
    console.log(votes)
    const content = <div>
        {votes.length > 0 ? <div>
            {votes.map(vote =>  <MyVote 
                                    key={vote.votationUuid}
                                    votationName={vote.votationName} 
                                    votationUuid={vote.votationUuid} 
                                    voteEnds={vote.voteEnds} 
                                    voteStarts={vote.voteStarts} 
                                    options={vote.options}
                                />
            )}
        </div> : <div>you have no pendent votes to use</div>}
    </div>
    return <div className="flex flex-col w-full center">
        <Navbar/>
        <RestrictedToLogin>
            {content}
        </RestrictedToLogin>
    </div>
}