// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address public owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;
    IGateway public gatewayContract;

    error CustomError(string message);

    constructor(
        string[] memory _candidateNames,
        uint256 _durationInMinutes,
        address payable gatewayAddress
    ) {
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(
                Candidate({ name: _candidateNames[i], voteCount: 0 })
            );
        }
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
        gatewayContract = IGateway(gatewayAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({ name: _name, voteCount: 0 }));
    }

    function vote(uint256 _candidateIndex) public payable {
    require(!voters[msg.sender], "You have already voted.");
    require(_candidateIndex < candidates.length, "Invalid candidate index.");

    candidates[_candidateIndex].voteCount++;
    voters[msg.sender] = true;

    bytes memory packet = abi.encode(msg.sender, _candidateIndex);
    bytes memory requestPacket = abi.encode(address(this), packet);

    gatewayContract.iSend{ value: msg.value }(
        1,
        0,
        string(""),
        "router_9601-1", // mandara testnet chainid 
        bytes(""), // requestMetadata
        requestPacket
    );
}

    function getAllVotesOfCandidates()
        public
        view
        returns (Candidate[] memory)
    {
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return
            (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        require(
            block.timestamp >= votingStart,
            "Voting has not started yet."
        );
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    receive() external payable {}
}
