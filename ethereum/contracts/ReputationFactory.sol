pragma solidity ^0.5.10;

import './Reputation.sol';

contract ReputationFactory {
    uint deployedReputationCount = 0;
    mapping(address => address) public deployedReputations;

    function createReputation() public {
        require(deployedReputations[msg.sender] == address(0x0), "A reputation contract has already been created for you.");

        Reputation newReputation = new Reputation(msg.sender);
        deployedReputations[msg.sender] = address(newReputation);
        deployedReputationCount += 1;
    }
}
