// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



import "@routerprotocol/router-crosstalk/contracts/RouterCrossTalk.sol";

contract Voting is RouterCrossTalk {

     uint256 private _crossChainGasLimit;
    uint256 private _crossChainGasPrice;

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address public owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;


    error CustomError(string message);

    constructor(
        string[] memory _candidateNames,
        uint256 _durationInMinutes,
        address _genericHandler
    ) RouterCrossTalk(_genericHandler) {
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(
                Candidate({ name: _candidateNames[i], voteCount: 0 })
            );
        }
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
        // RouterCrossTalk(_genericHandler);
       
    }

    function _routerSyncHandler(bytes4 _selector, bytes memory _data)
        internal
        virtual
        override
        returns (bool, bytes memory)
    {   
        if (_selector == bytes4(keccak256("getAllVotesOfCandidates(uint8)"))) {
        (uint8 targetChainId) = abi.decode(_data, (uint8));
        Candidate[] memory fetchedCandidates = getAllVotesOfCandidates();
          bytes memory returnData = abi.encode(fetchedCandidates);
        emit FetchedCandidates(targetChainId, fetchedCandidates);
        return (true, returnData);
    }

        (address _to, uint256 _amt) = abi.decode(_data, (address, uint256));
        (bool success, bytes memory returnData) = address(this).call(
            abi.encodeWithSelector(_selector, _to, _amt)
        );
        return (success, returnData);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // admin functions 
     function _approveFees(address _feeToken, uint256 _amount)
        external
        onlyOwner
    {
        approveFees(_feeToken, _amount);
    }

       function setLinker(address _addr) external  onlyOwner {
        setLink(_addr);
    }

    function setFeesToken(address _feeToken)
        external
        onlyOwner
    {
        setFeeToken(_feeToken);
    }


     function fetchCrossChainGasLimit() external view returns (uint256) {
        return _crossChainGasLimit;
    }


     function replayTransferCrossChain(
        bytes32 hash,
        uint256 crossChainGasLimit,
        uint256 crossChainGasPrice
    ) public  {
        routerReplay(hash, crossChainGasLimit, crossChainGasPrice);
    }


    // VOTING LOGIC STARTS HERE 


    // ADD CANDIDATES FUNTIONALITY ------------------------
    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({ name: _name, voteCount: 0 }));
    }


    function addCandidateCrossChain(uint8 _chainID, string memory _name) public onlyOwner returns(bool) {
        bytes memory data = abi.encode("addCandidate(string)", _name);
      
        bytes4 _selector = bytes4(keccak256("addCandidate(string)"));
        (bool success, ) = routerSend(
        _chainID,
        _selector,
        data,
        _crossChainGasLimit,
        _crossChainGasPrice
    );
    require(success == true, "unsuccessful");
    return success;
    }
// --------------------------------



    // VOTE FUNCTION FUNCTIONALITY -----------------------------

    function vote(address _voter, uint256 _candidateIndex) public {
    require(!voters[_voter], "You have already voted.");
    require(_candidateIndex < candidates.length, "Invalid candidate index.");

    // Check if the function is called by the contract itself or by the actual voter
    if (msg.sender != address(this)) {
        require(msg.sender == _voter, "You can only vote for yourself.");
    }

    candidates[_candidateIndex].voteCount++;
    voters[_voter] = true;
}

    // sending the cross chain voting request
    function voteCrossChain(
    uint8 _chainID,
    uint256 _candidateIndex
) external returns (bool) {
    bytes memory data = abi.encode(msg.sender, _candidateIndex);
    bytes4 _selector = bytes4(keccak256("vote(address,uint256)"));
    (bool success, ) = routerSend(
        _chainID,
        _selector,
        data,
        _crossChainGasLimit,
        _crossChainGasPrice
    );
    require(success == true, "unsuccessful");
    return success;
}

// ------------------------------------------------------------


// GETTING VOTES FROM DIFFERENT CHAINS -------------------------
    event FetchedCandidates(uint8 chainID, Candidate[] candidates);

    function getAllVotesOfCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getAllVotesOfCandidatesCrossChain(uint8 targetChainId) public {
         bytes memory data = abi.encodeWithSignature("getAllVotesOfCandidates(uint8)", targetChainId);
    // Execute the cross-chain request using Router CrossTalk
    bytes4 _selector = bytes4(keccak256("getAllVotesOfCandidates(uint8)"));
    (bool success,  ) = routerSend(
        targetChainId,
        _selector,
        data,
        _crossChainGasLimit,
        _crossChainGasPrice
    );

    
    require(success, "Cross-chain request failed");
}
       


    // -------------------------------------------

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

}
