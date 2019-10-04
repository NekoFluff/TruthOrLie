pragma solidity ^0.5.10;

import './Topic.sol';

contract TopicFactory {
    address[] public deployedTopics;

    function createTopic(string memory topicContent, uint minInvestment, uint hoursAvailable) payable public {
        Topic newTopic = new Topic(topicContent, minInvestment, hoursAvailable, msg.sender);
        address payable newTopicAddress = address(uint160(address(newTopic)));
        newTopicAddress.transfer(address(this).balance);
        deployedTopics.push(address(newTopic));
    }

    function getDeployedTopics() public view returns (address[] memory) {
        return deployedTopics;
    }
}