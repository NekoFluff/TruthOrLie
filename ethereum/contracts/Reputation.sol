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
    Topic[] topics;

    modifier _ownerOnly() {
        require(msg.sender == owner, 'You must be the creator of this Topic in order to do this.');
        _;
    }

    constructor(address sender) public {
        rep = 100;
        owner = sender;
    }

    function addTopic(Topic topic) public _ownerOnly {
        require(topic.creator() == owner, "Must be the creator of the Topic in order to add it.");
        topics.push(topic);
    }
}