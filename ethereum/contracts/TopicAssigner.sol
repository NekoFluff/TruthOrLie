pragma solidity ^0.5.10;

import "./TopicFactory.sol";
// import "github.com/provable-things/ethereum-api/provableAPI.sol";
import "./provableAPI_0.5.sol";

contract TopicAssigner is usingProvable {
    uint256 constant MAX_INT_FROM_BYTE = 256;
    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 8;
    uint256 NUM_VISIBLE_TOPICS = 25;

    address public owner;
    address public topicFactoryAddress = 0x02992af1dd8140193b87d2Ab620CA22F6E19f26C;

    mapping(bytes32 => address) public queryToUserAddress;
    mapping(address => uint) public assignedVisibleTopics;

    event LogNewProvableQuery(string description);
    
    modifier _ownerOnly() {
        require(msg.sender == owner, 'You must be the creator of this Topic in order to do this.');
        _;
    }
    
    constructor() public {
        provable_setProof(proofType_Ledger);
        owner = msg.sender;
    }
    
    function changeNumVisibleTopics(uint numTopics) public _ownerOnly {
        NUM_VISIBLE_TOPICS = numTopics;
    }

    function getRandomTopics(address sender) public view returns (address[] memory) {
        TopicFactory topicFactory = TopicFactory(topicFactoryAddress);
        uint256 ceiling = topicFactory.getNumberOfDeployedContracts();
        require(
            ceiling > 0,
            "No topic contracts are deployed. Unable to perform random topic assignment"
        );

        uint randomSeed = assignedVisibleTopics[sender];
        //require(randomSeed != 0, "You must press the refresh button at least once to generate a random seed.");
        if (randomSeed == 0) {
            return new address[](0);
        } else {
            uint256[] memory indices = new uint256[](NUM_VISIBLE_TOPICS);
    
            for (uint8 i = 0; i < NUM_VISIBLE_TOPICS; i++) {
                randomSeed = uint(keccak256(abi.encodePacked(randomSeed)));
                indices[i] = (randomSeed % ceiling);
            }
    
            return topicFactory.getTopicsAtIndices(indices);
        }

    }
    
    function hasTopic(address sender, address topicAddress) public view returns (bool) {
        address[] memory availableTopics = getRandomTopics(sender);
        for (uint8 i = 0; i < NUM_VISIBLE_TOPICS; i++) {
            if (availableTopics[i] == topicAddress) {
                return true;
            }
        }
        return false;
    }

    // The user calls this function to pick a random set of topics
    function refreshRandomTopics() public payable {
        TopicFactory topicFactory = TopicFactory(topicFactoryAddress);
        uint256 ceiling = topicFactory.getNumberOfDeployedContracts();
        require(
            ceiling > 0,
            "No topic contracts are deployed. Unable to perform random topic assignment"
        );

        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 200000;
        bytes32 queryId = provable_newRandomDSQuery(
            QUERY_EXECUTION_DELAY,
            NUM_RANDOM_BYTES_REQUESTED,
            GAS_FOR_CALLBACK
        );

        queryToUserAddress[queryId] = msg.sender;
        emit LogNewProvableQuery(
            "Provable query was sent, standing by for the answer..."
        );
    }

    // Callback function for the provable API
    function __callback(bytes32 _queryId, string memory _result,bytes memory _proof) public {
        require(msg.sender == provable_cbAddress());

        if (provable_randomDS_proofVerify__returnCode(_queryId,_result,_proof) !=0) { // The proof verification has failed! Handle this case however you see fit.
            revert();
        } else { // The proof verifiction has passed!

            // Make sure there are contracts available
            TopicFactory topicFactory = TopicFactory(topicFactoryAddress);
            uint256 ceiling = topicFactory.getNumberOfDeployedContracts();
            require(ceiling > 0, "No topic contracts are deployed. Unable to perform random topic assignment");

            // Generate random number
            // address[NUM_VISIBLE_TOPICS] storage visibleTopics = assignedVisibleTopics[queryToUserAddress[_queryId]];
            uint256 hash = uint256(keccak256(abi.encodePacked(_result)));
            assignedVisibleTopics[queryToUserAddress[_queryId]] = hash;

            // By hashing, pick the remaining topics
            // for (uint256 i = 0; i < NUM_VISIBLE_TOPICS; i++) {
            //     hash = uint256(keccak256(abi.encodePacked(hash)));
            //     visibleTopics[i] = topicFactory.deployedTopics(hash % ceiling);
            // }

            delete queryToUserAddress[_queryId];
        }
    }
}

