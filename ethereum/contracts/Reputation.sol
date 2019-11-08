pragma solidity ^0.5.10;

import './Topic.sol';

contract Reputation {
    struct Argument {
        string content; // The argument in words
        bool isTrue; // Whether this argument thinks the statement is true or false.
        address creator;
        uint voteCount;
    }
    
    address public owner;
    uint public rep;
    address[] topics;

    modifier _ownerOnly() {
        require(msg.sender == owner, 'You must be the creator of this Topic in order to do this.');
        _;
    }

    constructor(address sender) public {
        rep = 100;
        owner = sender;
    }

    function addTopic(address payable topicAddress, address sender) public {
        require(Topic(topicAddress).creator() == sender, "Must be the creator of the Topic in order to add it.");
        topics.push(topicAddress);
    }

    function getNumberOfTopics() public view returns (uint) {
        return topics.length;
    }

    function getTopics(uint startIndex, uint endIndex) public view returns (address[] memory) {
        uint diff = endIndex - startIndex;
        address[] memory tempTopics = new address[](endIndex-startIndex);

        for (uint i = 0; i < diff; i++) {
            tempTopics[i] = address(topics[startIndex + i]);
        }
        return tempTopics;
    }
}