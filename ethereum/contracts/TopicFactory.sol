pragma solidity ^0.5.10;

import './Topic.sol';
import './ReputationFactory.sol';

contract TopicFactory {
    address[] public deployedTopics;
    // address reputationFactoryAddress = 0x0604F9a0026613175C1A38a51e090aA96BB4e8B0;
    address reputationFactoryAddress = 0x4BE24Ebd7D7623456B0Dd3aaEF27039E2e176bc7;

    function createTopic(string memory topicContent, uint minInvestment, uint hoursAvailable) payable public {
        Topic newTopic = new Topic(reputationFactoryAddress, topicContent, minInvestment, hoursAvailable, msg.sender);
        address payable newTopicAddress = address(uint160(address(newTopic)));
        newTopicAddress.transfer(address(this).balance);
        deployedTopics.push(address(newTopic));

        // In an attempt to only perform a single transaction, we add the topic right after creation.
        ReputationFactory reputationFactory = ReputationFactory(reputationFactoryAddress);
        address reputationAddress = reputationFactory.deployedReputations(msg.sender);
        Reputation(reputationAddress).addTopic(newTopicAddress, msg.sender);
    }

    function getNumberOfDeployedContracts() public view returns (uint) {
        return deployedTopics.length;
    }

    function getContracts(uint startIndex, uint endIndex) public view returns (address[] memory) {
        uint diff = endIndex - startIndex;
        address[] memory topics = new address[](endIndex-startIndex);

        for (uint i = 0; i < diff; i++) {
            topics[i] = (deployedTopics[startIndex + i]);
        }
        return topics;
    }
}