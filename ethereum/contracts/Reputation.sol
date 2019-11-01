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
    Topic[] activeTopics;
    Topic[] inactiveTopics;


    modifier _ownerOnly() {
        require(msg.sender == owner, 'You must be the creator of this Topic in order to do this.');
        _;
    }

    function() external payable {}

    constructor(address sender) public {
        rep = 100;
        owner = sender;
    }
}