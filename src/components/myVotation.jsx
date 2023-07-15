import Link from "next/link";
import { useState } from "react";
import useVotingApp from "./useFlowVottingApp";
export default function MyVotation({name,uuid}){
    const [address,setAddress] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    const [succefulMessage,setSuccefulMessage] = useState('')
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
        console.log(data)
        setSuccefulMessage("candidate added succefully")
    }

    function onChangeAddress (e){
        if(e.target.value.length>"0xc6a01f56e1ff8764"){
            return 
        }
        setAddress(e.target.value)
    }
    return <div>
        <br/>
        <br/>
        <div>
            votation name: {name}
        </div>
        
        <div>
            <div>add candidate address</div>
            {errorMessage.length > 0 ? <div>error message:{errorMessage}</div> : <div></div>}
            {succefulMessage.length >0 ? <div>succefull message:{succefulMessage}</div> : <div></div>}
            <input value={address} placeholder="0xc6a01f56e1ff8764" onChange={onChangeAddress}className="text-black outline-secondary py-2 pl-4 w-3/5"/>
            <button onClick={onaddCandidate}>Add Candidate</button>
        </div>
        <Link href={`${window.location.href}/votation/${uuid}`}>
            <div>
                Click to go to Votation Details --&gt;
            </div>
        </Link>
        
        <div>
            link to share the votation and see the stadistics: {window.location.href}/votation/{uuid}
        </div>
    </div>
}