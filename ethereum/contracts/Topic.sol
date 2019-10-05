pragma solidity ^0.5.10;

contract Topic {
    struct Argument {
        string content; // The argument in words
        bool isTrue; // Whether this argument thinks the statement is true or false.
        address creator;
        uint voteCount;
    }
    
    string public content;
    address public creator;
    bool public isPublic;
    uint public minimumInvestment;
    uint public endTime;
    Argument[] public arguments;

    mapping(address => uint) public voted;
    mapping(address => bool) public createdArgument;
    address payable[] public truthVoters; //TODO: Remove?
    address payable[] public lieVoters; // TODO: Remove?

    bool public isCompleted;
    uint public majority;
    uint public payPerIndividual;

    modifier _creatorOnly() {
        require(msg.sender == creator, 'You must be the creator of this Topic in order to do this.');
        _;
    }

    modifier _publicOnly() {
        require(isPublic == true, 'The Topic has not been made public by the creator yet.');
        _;
    }

    modifier _mustBeWithinTimeFrame() {
        // require(isCompleted == false, 'The period for the Topic has already ended.');
        require(block.timestamp < endTime, 'The period for the Topic has already ended.');
        _;
    }

    function() external payable {}

    constructor(string memory topicContent, uint minInvestment, uint hoursAvailable, address sender) public {
        content = topicContent;
        minimumInvestment = minInvestment;
        creator = sender;
        isPublic = false;
        majority = 0;
        payPerIndividual = 0;
        endTime = block.timestamp + hoursAvailable  * 1 seconds;

        // The first argument of every topic is always
        createArgument('You have not chosen yet whether the statement is true or false', false);
    }

    function makePublic() public _mustBeWithinTimeFrame _creatorOnly {
        isPublic = true;
    }

    // You help determine the truth. Majority rules!
    function vote(uint argumentIndex) public payable _mustBeWithinTimeFrame _publicOnly {
        require(argumentIndex != 0, 'You cannot vote for the argument generated by the contract.');
        require(voted[msg.sender] == 0, 'You have already voted. You may not change your vote.');
        require(msg.value >= minimumInvestment, 'You must invest at least the minimum amountas decided by the creator.');

        voted[msg.sender] = argumentIndex;
        arguments[argumentIndex].voteCount++;
        if (arguments[argumentIndex].isTrue) {
            truthVoters.push(msg.sender);
        } else {
            lieVoters.push(msg.sender);
        }
    }

    function getTruthCount() public view returns (uint) {
        return truthVoters.length;
    }

    function getLieCount() public view returns (uint) {
        return lieVoters.length;
    }

    function createArgument(string memory argumentContent, bool belief) public _mustBeWithinTimeFrame {
        // require(isPublic == true || msg.sender == address(factory), 'The Topic has not been made public by the creator yet.');
        require(createdArgument[msg.sender] == false, 'You have already created an argument.');

        Argument memory newArgument = Argument({
            content: argumentContent,
            isTrue: belief,
            creator: msg.sender,
            voteCount: 0
        });
        arguments.push(newArgument);

        createdArgument[msg.sender] = true;
    }

    function modifyArgument(uint argumentIndex, string memory newContent) public _mustBeWithinTimeFrame _publicOnly {
        Argument storage arg = arguments[argumentIndex];
        require(arg.creator == msg.sender, 'You must be the creator of this argument to modify its contents');

        arg.content = newContent;
    }

    function getArgumentCount() public view returns (uint) {
        return arguments.length;
    }

    // Prevent additional submissions (after time period)
    // function endTopic() public _mustBeWithinTimeFrame {
    //     isCompleted = true;
    // }

    function calculateMajority() public {
        require(majority == 0, 'Majority has already been decided.');
        require(isCompleted == false, 'Topic is already marked as completed.');
        require(block.timestamp > endTime, 'Majority can only be calculated after the time period has ended.');

        uint truthCount = getTruthCount();
        uint lieCount = getLieCount();
        uint winnerCount = 0;

        if (truthCount > lieCount) {
            majority = 1;
            winnerCount = truthCount;
        } else if (truthCount < lieCount) {
            majority = 2;
            winnerCount = lieCount;
        } else {
            majority = 3;
            winnerCount = truthCount + lieCount;
        }

        payPerIndividual = address(this).balance / winnerCount;

        isCompleted = true;
    }

    function claim() public {
        require(block.timestamp > endTime, 'You can only claim your rewards after the time period.');
        uint argumentIndex = voted[msg.sender];
        require(argumentIndex != 0, 'You did not vote during the period, so you cannot claim.');
        Argument storage arg = arguments[argumentIndex];

        // Get majority
        if (majority == 0) {
            calculateMajority();
        }

        if ((majority == 1 && arg.isTrue) || (majority == 2 && !arg.isTrue) || (majority == 3)) {
            msg.sender.transfer(payPerIndividual);
        }
    }

    function creatorClaim() public _creatorOnly {
        require((getTruthCount() + getLieCount() == 0), 'The money goes to the people who participated in the process.');
        require(block.timestamp > endTime, 'You can only claim your rewards after the time period.');

        msg.sender.transfer(address(this).balance);
    }


    // function distributeMoney() public _creatorOnly {
    //     require(isCompleted == true, 'The period for the Topic must have ended in order to redistribute the money.');
    //     uint truthCount = getTruthCount();
    //     uint lieCount = getLieCount();

    //     uint winnerCount;
    //     address payable[] memory winnerAddresses;

    //     // TODO Change money distribution formula
    //     uint total = address(this).balance;
    //     if (truthCount > lieCount) {
    //         winnerCount = truthVoters.length;
    //         winnerAddresses = truthVoters;
    //     } else if (lieCount < truthCount) {
    //         winnerCount = lieVoters.length;
    //         winnerAddresses = lieVoters;
    //     } else {
    //         winnerCount = truthVoters.length + lieVoters.length;
    //         winnerAddresses = concatenateArrays(truthVoters, lieVoters);
    //     }

    //     uint perIndividual = total / winnerCount;
    //     for (uint i = 0; i < winnerCount; i++) {
    //         winnerAddresses[i].transfer(perIndividual);
    //     }
    // }



    // function getDetails() public view returns (uint minimumContribution, uint balance, uint requestCount, uint contributorCount, address manager) {
    //     // (uint minimumContribution, uint balance, uint requestCount, uint contributorCount, address manager)
    //     return (
    //         minimumContribution,
    //         address(this).balance,
    //         requests.length,
    //         contributorCount,
    //         manager
    //     );
    // }

    // function concatenateArrays(address payable[] storage arr1, address payable[] storage arr2) private view returns(address payable[] memory) {
    //     address payable[] memory returnArr = new address payable[](arr1.length + arr2.length);

    //     uint i = 0;
    //     for (; i < arr1.length; i++) {
    //         returnArr[i] = arr1[i];
    //     }

    //     uint j = 0;
    //     while (j < arr1.length) {
    //         returnArr[i++] = arr2[j++];
    //     }

    //     return returnArr;
    // }
}