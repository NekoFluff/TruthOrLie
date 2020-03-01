pragma solidity ^0.5.10;

import './Topic.sol';

contract Reputation {
    address reputationFactoryAddress;
    
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

    function addTopic(address payable topicAddress) public {
        require(Topic(topicAddress).creator() == owner, "Must be the creator of the Topic in order to add it.");
        topics.push(topicAddress);
    }

    function getTopics(uint startIndex, uint endIndex) public view returns (address[] memory) {
        uint diff = endIndex - startIndex;
        address[] memory tempTopics = new address[](endIndex-startIndex);

        for (uint i = 0; i < diff; i++) {
            tempTopics[i] = address(topics[startIndex + i]);
        }
        return tempTopics;
    }

    function getNumberOfTopics() public view returns (uint) {
        return topics.length;
    }

    function getVotedTopics(uint startIndex, uint endIndex) public view returns (address[] memory) {
        uint diff = endIndex - startIndex;
        address[] memory tempTopics = new address[](endIndex-startIndex);

        for (uint i = 0; i < diff; i++) {
            tempTopics[i] = address(votedTopics[startIndex + i]);
        }
        return tempTopics;
    }

    function getNumberOfVotedTopics() public view returns (uint) {
        return votedTopics.length;
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