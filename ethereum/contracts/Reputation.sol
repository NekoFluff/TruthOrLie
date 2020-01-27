pragma solidity ^0.5.10;

import './Topic.sol';

contract Reputation {
    address reputationFactoryAddress;

    struct Argument {
        string content; // The argument in words
        bool isTrue; // Whether this argument thinks the statement is true or false.
        address creator;
        uint voteCount;
    }
    
    address public owner;
    uint public rep;
    address[] topics;
    address[] votedTopics;

    modifier _ownerOnly() {
        require(msg.sender == owner, 'You must be the creator of this Topic in order to do this.');
        _;
    }

    modifier _reputationFactoryOnly() {
        require(msg.sender == reputationFactoryAddress, 'Only the reputation factory can invoke this function.');
        _;
    }

    constructor(address repFactoryAddress, address sender) public {
        reputationFactoryAddress = repFactoryAddress;
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

    function getVotedTopics(uint startIndex, uint endIndex) public view returns (address[] memory) {
        uint diff = endIndex - startIndex;
        address[] memory tempTopics = new address[](endIndex-startIndex);

        for (uint i = 0; i < diff; i++) {
            tempTopics[i] = address(votedTopics[startIndex + i]);
        }
        return tempTopics;
    }

    function addReputation(uint addRep) public _reputationFactoryOnly {
        rep += addRep;
    }

    function spendReputation(address topic, uint removeRep) public _reputationFactoryOnly {
        require(rep >= removeRep, "You don't have enough rep to give away.");
        votedTopics.push(topic);
        rep -= removeRep;
    }
}