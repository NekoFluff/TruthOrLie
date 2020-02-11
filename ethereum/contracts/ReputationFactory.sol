pragma solidity ^0.5.10;

import "./Reputation.sol";
import "./Topic.sol";

contract ReputationFactory {
    uint256 deployedReputationCount = 0;
    mapping(address => address) public deployedReputations;

    modifier _topicContractsOnly() {
        Topic topic = Topic(msg.sender);
        // require(topic.isTopic(), "Only Topic Contracts can invoke this function");
        topic.getTruthCount();
        _;
    }

    function createReputation() public {
        require(
            deployedReputations[msg.sender] == address(0x0),
            "A reputation contract has already been created for you."
        );

        Reputation newReputation = new Reputation(address(this), msg.sender);
        deployedReputations[msg.sender] = address(newReputation);
        deployedReputationCount += 1;
    }

    function addReputation(uint256 addRep, address sender)
        public
        _topicContractsOnly
    {
        Reputation userReputation = Reputation(deployedReputations[sender]);
        require(
            userReputation.owner() == sender,
            "Must be the owner of the Reputation Contract in order to use it."
        );
        userReputation.addReputation(addRep);
    }

    function spendReputation(
        address topicAddress,
        uint256 removeRep,
        address sender
    ) public _topicContractsOnly {
        Reputation userReputation = Reputation(deployedReputations[sender]);
        require(
            userReputation.owner() == sender,
            "Must be the owner of the Reputation Contract in order to use it."
        );
        userReputation.spendReputation(topicAddress, removeRep);
    }
}
