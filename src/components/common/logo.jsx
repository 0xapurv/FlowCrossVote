'use client';

import Link from "next/link";

const Logo = () => {
    return (
        <Link href='/'>
            <div className="text-white font-bold text-[1.6rem] hover:text-secondary transition duration-300">
                VoteChain
            </div>
        </Link>
    );
}
 
export default Logo;