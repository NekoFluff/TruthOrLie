pragma solidity ^0.5.10;

contract Topic {
    struct Argument {
        string content; // The argument in words
        bool isTrue; // Whether this argument thinks the statement is true or false.
        address creator;
    }

    string public content;
    address public creator;
    bool public isPublic;
    uint public truthCount;
    uint public lieCount;
    Argument[] public arguments;

    mapping(address => uint) public voted;

    modifier _creatorOnly() {
        require(msg.sender == creator, 'You must be the creator of this Topic in order to do this.');
        _;
    }

    constructor(string memory topicContent) public {
        content = topicContent;
        creator = msg.sender;
        isPublic = false;
        truthCount = 0;
        lieCount = 0;

        // The first argument of every topic is always 
        createArgument('You have not chosen yet whether the statement is true or false', false);
    }

    function makePublic() public _creatorOnly {
        isPublic = true;
    }
    
    // You help determine the truth. Majority rules!
    function vote(uint argumentIndex) public {
        require(voted[msg.sender] == 0, 'You have already voted. You may not change your vote.');

        voted[msg.sender] = argumentIndex;
        if (arguments[argumentIndex].isTrue) {
            truthCount++;
        } else {
            lieCount++;
        }
    }

    function createArgument(string memory argumentContent, bool belief) public {
        Argument memory newArgument = Argument({
            content: argumentContent,
            isTrue: belief,
            creator: msg.sender
        });
        arguments.push(newArgument);
    }
}