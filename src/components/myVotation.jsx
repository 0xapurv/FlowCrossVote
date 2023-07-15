import Link from "next/link";
import { useState, useContext } from "react";
import useVotingApp from "./useFlowVottingApp";
import { WalletContext } from '@/src/contexts/WalletContext';
export default function MyVotation({name,uuid}){
    const [address,setAddress] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    const [succefulMessage,setSuccefulMessage] = useState('')
    let user = useContext(WalletContext);
    const votingapp = new useVotingApp()
    async function onaddCandidate(){
        if(address>"0xc6a01f56e1ff8764"){
            setErrorMessage("please enter a valid address")
            return 
        }
        if(address.substring(0,2)!="0x"){
            setErrorMessage("please enter a valid address")
            return  
        }
        setErrorMessage("")
        const scriptdata = await votingapp.scriptIsUserSignedUp(address)
        if(scriptdata.data == false){
            setErrorMessage("the candidate has to login the app before to become a possible candidate")
            return  
        }
        const data = await votingapp.transactionAddCandidate(uuid,address)
        setSuccefulMessage("candidate added succefully")
    }

    function onChangeAddress (e){
        if(e.target.value.length>"0xc6a01f56e1ff8764"){
            return 
        }
        setAddress(e.target.value)
    }
    return (
        <div className="w-screen center mt-10">
            <div className="my-10 w-[85%]">
                <div className="text-md mb-2">
                    Votation name: {name}
                </div>
                
                <div>
                    <div>add candidate address</div>
                    <input className="text-black outline-secondary py-2 pl-4 w-3/5 mb-1"/>
                    <div>{errorMessage}</div>
                    <button>Add Candidate</button>
                </div>
                <Link href={`${window.location.href}/votation/${uuid}`}>
                    <div>
                        Click to go to Votation Details --&gt;
                    </div>
                </Link>
                
                <div>
                    link to share the votation and see the staistics: {window.location.href}/votation/{uuid}
                </div>
            </div>
        </div>
    )
}