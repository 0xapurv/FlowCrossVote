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

    const currentURL = new URL(window.location.href);
    const baseURL = `${currentURL.protocol}//${currentURL.host}/`;
    return <div className="w-screen center mt-16">
        <div className="w-[85%] flex flex-col mb-10">
            <div>
                votation name: {name}
            </div>

            <div>
                <div className="my-2">add candidate address</div>
                {errorMessage.length > 0 ? <div>{errorMessage}</div> : <div></div>}
                {succefulMessage.length >0 ? <div>{succefulMessage}</div> : <div></div>}
                <input value={address} placeholder="0xc6a01f56e1ff8764" onChange={onChangeAddress}className="text-black outline-secondary py-2 pl-4 w-3/5"/>
                <button className="ml-6 bg-secondary px-6 py-3 text-[.9rem] hover:scale-95 transition-all duration-300" onClick={onaddCandidate}>Add Candidate</button>
            </div>
            <Link href={`${baseURL}votation/${uuid}owner${user.addr}`}>
                <button className='bg-secondary px-6 py-2 text-[.9rem] hover:scale-95 transition-all duration-300 mt-1 mb-3'>
                    Click to go to Votation Details --&gt;
                </button>
            </Link>

            <div>
                link to share the votation and see the stadistics: {baseURL}votation/{uuid}owner{user.addr}
            </div>
        </div>
    </div>
}