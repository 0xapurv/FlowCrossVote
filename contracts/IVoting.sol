// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@routerprotocol/evm-gateway-contracts@1.1.11/contracts/IDapp.sol";
import "@routerprotocol/evm-gateway-contracts@1.1.11/contracts/IGateway.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is IDapp, Ownable {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    IGateway public gatewayContract;

    constructor(
        string[] memory _candidateNames,
        uint256 _durationInMinutes,
        address payable gatewayAddress
    ) {
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
        gatewayContract = IGateway(gatewayAddress);
    }


    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({
            name: _name,
            voteCount: 0
        }));
    }

    function vote(uint256 _candidateIndex, bytes memory voterAddress) public {
        address voter = toAddress(voterAddress);
        require(!voters[voter], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        candidates[_candidateIndex].voteCount++;
        voters[voter] = true;
    }

    function getAllVotesOfCandiates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet.");
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    function setGateway(address gateway) external onlyOwner {
        gatewayContract = IGateway(gateway);
    }

    function toAddress(bytes memory _address) internal pure returns (address) {
        assembly {
            mstore(add(0x20, _address), 20)
        }
        return address(uint160(uint256(keccak256(_address))));
    }

    function voteCrossChain(
        uint256 _candidateIndex,
        bytes calldata voterAddress,
        string calldata destChainId,
        bytes calldata requestMetadata
    ) public {
        require(getVotingStatus(), "Voting is not active.");

        // Vote on behalf of the voter from the other chain
        vote(_candidateIndex, voterAddress);

        // Send the vote to the destination chain
        bytes memory packet = abi.encode(_candidateIndex, voterAddress);
        bytes memory requestPacket = abi.encode(packet);

        gatewayContract.iSend(
            1,
            0,
            string(""),
            destChainId,
            requestMetadata,
            requestPacket
        );
    }

    function iReceive(
        string memory,
        bytes memory packet,
        string memory srcChainId
    ) external override returns (bytes memory) {
        require(msg.sender == address(gatewayContract), "only gateway");

        (uint256 _candidateIndex, bytes memory voterAddress) = abi.decode(packet, (uint256, bytes));

        // Vote on behalf of the voter from the source chain
        vote(_candidateIndex, voterAddress);

        return abi.encode(srcChainId);
    }

    
    function iAck(uint256 requestIdentifier, bool execFlags, bytes memory execData) external override {
        // Implementation of the iAck function, which is required by the IDapp interface
        // Add your code here
    }
}

