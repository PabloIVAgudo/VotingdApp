// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract VotingV3 {
    // Structure for each candidate
    struct Candidate {
        uint256 id;
        string name;
        uint256 votes;
    }

    // List of candidates
    Candidate[] public candidates;

    // Owner's address
    address public owner;

    // Map all voters addresses
    mapping(address => bool) public voters;

    // List of voters
    address[] public listOfVoters;

    // Create a voting start and end session
    uint256 public votingStart;
    uint256 public votingEnd;

    // Create election status.
    bool public electionStarted;

    // Modifier to restrict creating election to the owner only
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "You are not authorized to start an election"
        );
        _;
    }

    // Modifier to check if the election ongoing
    modifier electionOngoing() {
        require(electionStarted, "No election yet");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to start an election
    function startElection(
        string[] memory _candidates,
        uint256 _votingDuration
    ) public onlyOwner {
        require(electionStarted == false, "Election is currently ongoing");
        delete candidates;
        resetAllVoterStatus();

        for (uint256 i = 0; i < _candidates.length; i++) {
            candidates.push(Candidate({id: i, name: _candidates[i], votes: 0}));
        }

        electionStarted = true;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_votingDuration * 1 minutes);
    }

    // Function to end the election
    function endElection() public onlyOwner {
        electionStarted = false;
        delete candidates;
        resetAllVoterStatus();
    }

    //Function to add a new candidate
    function addCandidate(
        string memory _name
    ) public onlyOwner electionOngoing {
        require(checkElectionPeriod(), "Election period has ended.");
        candidates.push(
            Candidate({id: candidates.length, name: _name, votes: 0})
        );
    }

    // Function to check voter's status
    function voterStatus(
        address _voter
    ) public view electionOngoing returns (bool) {
        return voters[_voter];
    }

    // Function to vote
    function voteTo(uint256 _id) public electionOngoing {
        require(checkElectionPeriod(), "Election period has ended.");
        require(
            !voterStatus(msg.sender),
            "You already voted. You can only vote once."
        );
        candidates[_id].votes++;
        voters[msg.sender] = true;
        listOfVoters.push(msg.sender);
    }

    // Function to get the number of votes
    function retrieveVotes() public view returns (Candidate[] memory) {
        return candidates;
    }

    // Function to monitor the election time
    function electionTimer() public view electionOngoing returns (uint256) {
        return block.timestamp >= votingEnd ? 0 : (votingEnd - block.timestamp);
    }

    // Function check if election period is still ongoing
    function checkElectionPeriod() public returns (bool) {
        if (electionTimer() > 0) {
            return true;
        }
        electionStarted = false;
        return false;
    }

    // Function to reset all voters status
    function resetAllVoterStatus() public onlyOwner {
        for (uint256 i = 0; i < listOfVoters.length; i++) {
            voters[listOfVoters[i]] = false;
        }
        delete listOfVoters;
    }
}
