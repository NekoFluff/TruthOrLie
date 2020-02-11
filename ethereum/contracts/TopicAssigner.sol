pragma solidity ^0.5.10;

import "./TopicFactory.sol";
import "github.com/provable-things/ethereum-api/provableAPI.sol";

contract TopicAssigner is usingProvable {
    uint256 constant MAX_INT_FROM_BYTE = 256;
    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 7;
    uint256 constant NUM_VISIBLE_TOPICS = 10;

    address public topicFactoryAddress = 0xEC94d51442921cC699Af052a2E8A2753597Af604;

    uint256 public randomNumber = 0;
    mapping(bytes32 => address) public queryToUserAddress;
    mapping(address => address[NUM_VISIBLE_TOPICS]) public assignedVisibleTopics;

    event LogNewProvableQuery(string description);

    constructor() public {
        provable_setProof(proofType_Ledger);
    }

    function getRandomTopics() public payable {
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

    function __callback(
        bytes32 _queryId,
        string memory _result,
        bytes memory _proof
    ) public {
        require(msg.sender == provable_cbAddress());
        TopicFactory topicFactory = TopicFactory(topicFactoryAddress);
        uint256 ceiling = topicFactory.getNumberOfDeployedContracts();
        require(
            ceiling > 0,
            "No topic contracts are deployed. Unable to perform random topic assignment"
        );

        if (
            provable_randomDS_proofVerify__returnCode(
                _queryId,
                _result,
                _proof
            ) !=
            0
        ) {
            /**
             * @notice  The proof verification has failed! Handle this case
             *          however you see fit.
             */
            revert();
        } else {
            /**
             *
             * @notice  The proof verifiction has passed!
             *
             */
            address[NUM_VISIBLE_TOPICS] storage visibleTopics = assignedVisibleTopics[queryToUserAddress[_queryId]];
            uint256 hash = uint256(keccak256(abi.encodePacked(_result)));
            randomNumber = hash;

            for (uint256 i = 0; i < NUM_VISIBLE_TOPICS; i++) {
                hash = uint256(keccak256(abi.encodePacked(hash)));
                // In an attempt to only perform a single transaction, we add the topic right after creation.
                visibleTopics[i] = topicFactory.deployedTopics(hash % ceiling);
            }
        }
    }

    function test() public {
        address[NUM_VISIBLE_TOPICS] storage visibleTopics = assignedVisibleTopics[msg
            .sender];
        TopicFactory topicFactory = TopicFactory(topicFactoryAddress);

        uint256 hash = 0;
        uint256 ceiling = topicFactory.getNumberOfDeployedContracts();
        // visibleTopics[0] = topicFactory.deployedTopics(0);

        for (uint256 i = 0; i < NUM_VISIBLE_TOPICS; i++) {
            hash = i;
            // In an attempt to only perform a single transaction, we add the topic right after creation.
            visibleTopics[i] = topicFactory.deployedTopics(hash % ceiling);
        }

    }
}
