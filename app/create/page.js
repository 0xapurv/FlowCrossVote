'use client'

import Navbar from "@/components/Navbar/Navbar";
import CreateVote from "./createVote";

const Create = () => {
    return (
        <div className="flex flex-col w-full center">
            <Navbar />
            <CreateVote />
        </div>
    );
}
 
export default Create;