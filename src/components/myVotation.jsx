import Link from "next/link";
import { useState } from "react";
export default function MyVotation({name,uuid}){
    const [address,setAddress] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    function onaddCandidate(){

    }
    return <div>
        <br/>
        <br/>
        <div>
            votation name: {name}
        </div>
        
        <div>
            <div>add candidate address</div>
            <input/>
            <div>{errorMessage}</div>
            <button>Add Candidate</button>
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