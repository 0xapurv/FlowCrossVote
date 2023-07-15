import Link from "next/link";
import { useState } from "react";
export default function MyVotation({name,uuid}){
    const [address,setAddress] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    function onaddCandidate(){

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