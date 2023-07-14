'use client';

import Image from 'next/image';
import CustomButton from '../common/button';

const Hero = () => {
  return (
    <div className="my-28 w-[90%] center flex-col">
      <div className='bespoke w-full h-full center'>
        <h1 className='text-xxxl text-center w-[80%] leading-snug'>
          Power to the People: Decentralized Voting Revolution
        </h1>
      </div>
      <div className='mt-6'>
        <CustomButton textSize='1.2rem' border='1px solid #A6245A' padding='15px 30px' background='#A6245A' borderRadius='0' textColor='#FFF'>Get Started <Image src="/images/redirect.png" alt='redirect' width={17} height={17}/></CustomButton>
      </div>
    </div>
  );
}
 
export default Hero;