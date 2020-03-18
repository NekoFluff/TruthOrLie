pragma solidity ^0.5.10;

import './ReputationFactory.sol';
import './TopicAssigner.sol';

contract Topic {
    address reputationFactoryAddress;
    address topicAssignerAddress;
    address topicFactoryAddress;

    struct Argument {
        string content; // The argument in words
        bool isTrue; // Whether this argument thinks the statement is true or false.
        address creator;
        uint voteCount;
    }
    
    string public content;
    address public creator;
    uint public minimumInvestment;
    uint public endTime;
    Argument[] public arguments;

    // Vote Section
    mapping(address => uint) public voted; // User to argument index
    address payable[] public truthVoters; //TODO: Remove?
    address payable[] public lieVoters; // TODO: Remove?

    // Monetary Investment Section
    mapping(address => uint) public monetaryInvestment; // User to wei investment
    uint public truthMonetaryInvestment;
    uint public lieMonetaryInvestment;
    uint public finalMonetaryTotal;
    
    // Reputation Investment Section
    mapping(address => uint) public reputationInvestment; // User to reputation investment
    uint public truthReputation;
    uint public lieReputation;
    uint public totalReputationInvestment;

    mapping(address => uint) public createdArgument; // User to argument index

    mapping(address => bool) public claimed; // Whether or not the user has already claimed their reward for this topic
    bool public isCompleted;
    uint public majority;

    modifier _creatorOnly() {
        require(msg.sender == creator, 'You must be the creator of this Topic in order to do this.');
        _;
    }

    modifier _mustBeWithinTimeFrame() {
        require(block.timestamp < endTime, 'The period for the Topic has already ended.');
        _;
    }

    function() external payable {}

    constructor(address _topicFactoryAddress, address repFactoryAddress, address _topicAssignerAddress, string memory topicContent, uint minInvestment, uint secondsAvailable, address sender) public {
        topicFactoryAddress = _topicFactoryAddress;
        reputationFactoryAddress = repFactoryAddress;
        topicAssignerAddress = _topicAssignerAddress;
        content = topicContent;
        minimumInvestment = minInvestment;
        creator = sender;
        majority = 0;
        endTime = block.timestamp + secondsAvailable  * 1 seconds;

        finalMonetaryTotal = 0;

        // The first argument of every topic is always
        createArgument('You have not chosen yet whether the statement is true or false', false);
    }

    function isTopic() public pure returns (bool) {
        return true;
    }

    function canVote() public view returns (bool) {
        TopicAssigner topicAssigner = TopicAssigner(topicAssignerAddress); 
        return voted[msg.sender] == 0 && topicAssigner.hasTopic(msg.sender, address(this));
    }

    // You help determine the truth. Majority rules!
    function vote(uint argumentIndex, uint reputationCost) public payable _mustBeWithinTimeFrame {
        require(argumentIndex != 0, 'You cannot vote for the argument generated by the contract.');
        require(msg.value >= minimumInvestment, 'You must invest at least the minimum amount as decided by the creator.');
        require(canVote(), "You don't have this topic on your available list or you have already voted.");
        
        // Commission for topic creators
        uint commission = msg.value * 2 / 100; 
        uint valueAfterCommision = msg.value - commission;
        address payable creatorPayable = address(uint160(address(creator)));
        creatorPayable.transfer(commission);

        ReputationFactory(reputationFactoryAddress).spendReputation(address(this), reputationCost, msg.sender);
        voted[msg.sender] = argumentIndex;
        monetaryInvestment[msg.sender] = valueAfterCommision;
        reputationInvestment[msg.sender] = reputationCost;
        totalReputationInvestment += reputationCost;

        arguments[argumentIndex].voteCount++;
        if (arguments[argumentIndex].isTrue) {
            truthVoters.push(msg.sender);
            truthReputation += reputationCost;
            truthMonetaryInvestment += valueAfterCommision;
        } else {
            lieVoters.push(msg.sender);
            lieReputation += reputationCost;
            lieMonetaryInvestment += valueAfterCommision;
        }
    }

    function getTruthCount() public view returns (uint) {
        return truthVoters.length;
    }

    function getLieCount() public view returns (uint) {
        return lieVoters.length;
    }

    function createArgument(string memory argumentContent, bool belief) public _mustBeWithinTimeFrame {
        require(createdArgument[msg.sender] == 0, 'You have already created an argument.');

        Argument memory newArgument = Argument({
            content: argumentContent,
            isTrue: belief,
            creator: msg.sender,
            voteCount: 0
        });
        arguments.push(newArgument);
        createdArgument[msg.sender] = getArgumentCount() - 1;

    }

    function modifyArgument(uint argumentIndex, string memory newContent, bool belief) public _mustBeWithinTimeFrame  {
        Argument storage arg = arguments[argumentIndex];
        require(arg.creator == msg.sender, 'You must be the creator of this argument to modify its contents');
        require(arg.voteCount == 0, 'Argument has already been voted on. Cannot be modified.');
        arg.content = newContent;
        arg.isTrue = belief;
    }

    function getArgumentCount() public view returns (uint) {
        return arguments.length;
    }

    // Prevent additional submissions (after time period)
    // function endTopic() public _mustBeWithinTimeFrame {
    //     isCompleted = true;
    // }

    function calculateMajority() internal {
        require(majority == 0, 'Majority has already been decided.');
        require(isCompleted == false, 'Topic is already marked as completed.');
        require(block.timestamp > endTime, 'Majority can only be calculated after the time period has ended.');

        uint truthCount = getTruthCount();
        uint lieCount = getLieCount();

        if (truthCount > lieCount) {
            majority = 1;
        } else if (truthCount < lieCount) {
            majority = 2;
        } else {
            majority = 3;
        }

        finalMonetaryTotal = address(this).balance;
        markAsCompleted();
    }
    
    function markAsCompleted() internal {
        isCompleted = true;
        
        // Mark as completed in the topic factory
        TopicFactory topicFactory = TopicFactory(topicFactoryAddress);
        topicFactory.markTopicAsCompleted(address(this));
    }

    function canClaim() public view returns (bool) {
        uint argumentIndex = voted[msg.sender];
        return block.timestamp > endTime && argumentIndex != 0 && !claimed[msg.sender];
    }

    function claim() public {
        require(canClaim(), 'You did not vote during the period or the period is not over.');
        uint argumentIndex = voted[msg.sender];
        Argument storage arg = arguments[argumentIndex];

        // Get majority
        if (majority == 0) {
            calculateMajority();
        }

        if (inMajority(msg.sender)) {
            msg.sender.transfer(this.calculateMonetaryGain(monetaryInvestment[msg.sender], arg.isTrue));
        }

        ReputationFactory repFactory = ReputationFactory(reputationFactoryAddress);
        repFactory.addReputation(this.calculateReputationGain(reputationInvestment[msg.sender], msg.sender), msg.sender);
        claimed[msg.sender] = true;
    }

    function creatorClaim() public _creatorOnly {
        require((getTruthCount() + getLieCount() == 0), 'The money goes to the people who participated in the process.');
        require(block.timestamp > endTime, 'You can only claim your rewards after the time period.');

        msg.sender.transfer(address(this).balance);
        markAsCompleted();
        claimed[msg.sender] = true;
    }

    // function calculateMonetaryGainForUser() public view returns (uint) {
    //     return this.calculateMonetaryGain(monetaryInvestment[msg.sender];
    // }

    function calculateMonetaryGain(uint initialMonetaryInvestment, bool onTruthSide) public view returns (uint) {
        uint tempTotalInvestment;
        if (onTruthSide) {
            tempTotalInvestment = truthMonetaryInvestment;
        } else {
            tempTotalInvestment = lieMonetaryInvestment;
        }

        if (tempTotalInvestment <= 0) {
            return 0;
        }

        if (isCompleted) {
            if (majority == 3) {
                tempTotalInvestment = truthMonetaryInvestment + lieMonetaryInvestment;
            }
            return finalMonetaryTotal * initialMonetaryInvestment / tempTotalInvestment;
        } else {
            return address(this).balance * initialMonetaryInvestment / tempTotalInvestment;
        }
    }

    function calculateReputationGain(uint initialReputation, address sender) public view returns (uint) {
        if (inMajority(sender)) {
            return initialReputation * 11 / 10; 
        } else {
            return initialReputation * 8 / 10; 
        }
    }

    function getDetails() public view returns (address, uint, uint, bool, bool, bool, uint, uint, uint, uint, uint) {
        return (creator, minimumInvestment, endTime, isCompleted, canClaim(), claimed[msg.sender], address(this).balance, getTruthCount(), getLieCount(), truthReputation, lieReputation);
    }

    function inMajority(address sender) public view returns (bool) {
        Argument storage arg = arguments[voted[sender]];
        return (majority == 1 && arg.isTrue) || (majority == 2 && !arg.isTrue) || (majority == 3);
    }

    function getMoneyPool() public view returns (uint) {
        return address(this).balance;
    }

    // Too much ether is spent on an individual
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