"use client"
import {Input , Button} from "@chakra-ui/react"
import React from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'

const Hero = (props) => {
  return (
    <div style={{backgroundColor:"#393E46"  , height:'100vh' , width:'100vw' , color:"#333" , paddingTop:'4rem'}}>

        {/* remaing time section */}
        <div className=' justify-center flex flex-row gap-16'>

        <div className="block" style={{color:"#7895CB", fontSize:'1.3rem' , margin:"auto 0 "}}>Remaning Time: <span style={{color:"#fff", fontSize:'1.6rem'}}>{"16792"}</span></div>

        </div>

        {/* Input section */}
        <div  className=' justify-center flex flex-row gap-16'  style={{marginTop:"2rem"}}>
        <div className="block" style={{display:'block' , width:'20rem'}}>
            <Input style={{display:'block', color:'#7895CB'}} className="block" type="number" placeholder="Enter Candidate Index..." />
        </div>
        </div>


    {/* Vote Section  */}
     <div className=' justify-center flex flex-row gap-16'  style={{marginTop:"2rem"}}>
        <Button colorScheme="twitter" variant="solid" size='lg' style={{width:'8rem'}}>
                Vote
        </Button>
     </div>

     {/* displaying vote section */}
     <div  className=' justify-center flex flex-row gap-16'  style={{margin:'2rem' , marginTop:'2rem'}}>


 
     <TableContainer>
  <Table variant='simple' style={{border:'2px solid #7895CB'}}>
    <TableCaption>Imperial to metric conversion factors</TableCaption>
    <Thead style={{border:'2px solid #7895CB'}}>
      <Tr>
        <Th style={{color:"#7895CB" ,fontSize:'1.1rem'}}>Index</Th>
        <Th  style={{color:"#7895CB" ,fontSize:'1.1rem'}}>Candidate Name </Th>
        <Th  style={{color:"#7895CB" ,fontSize:'1.1rem'}}> Candidate Votes</Th>
      </Tr>
    </Thead>
    <Tbody style={{border:'2px solid #7895CB'}}>
      <Tr style={{border:'2px solid #7895CB'}}>
        <Td style={{color:'#fff'}}>0</Td>
        <Td style={{color:'#fff'}}>Apurv</Td>
        <Td style={{color:'#fff'}} >3</Td>
      </Tr>
      <Tr style={{border:'2px solid #7895CB'}}>
        <Td style={{color:'#fff'}}>1</Td>
        <Td style={{color:'#fff'}}>Madhav</Td>
        <Td style={{color:'#fff'}} >5</Td>
      </Tr>
      <Tr  style={{border:'2px solid #7895CB'}}>
        <Td style={{color:'#fff'}}>2</Td>
        <Td style={{color:'#fff'}}>Yash</Td>
        <Td style={{color:'#fff'}} >1</Td>
      </Tr>
    </Tbody>
    <Tfoot>
      <Tr  style={{border:'2px solid #7895CB'}}>
        <Th  style={{color:'#fff'}}>3</Th>
        <Th  style={{color:'#fff'}}>Thor</Th>
        <Th  style={{color:'#fff'}} >2</Th>
      </Tr>
    </Tfoot>
  </Table>
</TableContainer>
</div>
    </div>
)
}

export default Hero