pragma solidity ^0.5.10;

import './Topic.sol';
import './ReputationFactory.sol';
import "./HitchensUnorderedKeySet.sol";

contract TopicFactory {
    
    using HitchensUnorderedKeySetLib for HitchensUnorderedKeySetLib.Set;
    HitchensUnorderedKeySetLib.Set topicSet;
    HitchensUnorderedKeySetLib.Set completedTopicSet;
    
    mapping(bytes32 => address) deployedTopics;
    mapping(bytes32 => address) completedTopics;
    
    event LogNewTopic(address sender, address topicAddress, uint minInvestment, uint hoursAvailable);
    // event LogUpdateTopic(address sender, address topicAddress, uint minInvestment, uint hoursAvailable);    
    event LogRemoveTopic(address sender, address topicAddress, bytes32 key);
    
    function addressToBytes32(address a) public pure returns(bytes32) {
      return bytes32(uint(uint160(a)));
    }
    
    function bytes32ToAddress(bytes32 b) public pure returns(address) {
      return address(uint160(uint(b)));
    }
    
    address public owner;
    //address[] public deployedTopics; // TODO: Remove
    
    address reputationFactoryAddress = 0x6C141A0f5D7Eb04129746200De3475535537BE1a;
    address topicAssignerAddress;
    
    modifier _ownerOnly() {
        require(msg.sender == owner, 'You must be the creator of this Topic Factory in order to do this.');
        _;
    }
    
    constructor() public {
        owner = msg.sender;
    }
    
    function updateTopicAssignerAddress(address _topicAssignerAddress) public _ownerOnly {
        topicAssignerAddress = _topicAssignerAddress;
    }
    
    function createTopic(string memory topicContent, uint minInvestment, uint hoursAvailable) payable public {
        require(topicAssignerAddress != address(0), "A Topic Assigner contract address must be assigned before being able to create any new topics.");
        Topic newTopic = new Topic(address(this), reputationFactoryAddress, topicAssignerAddress, topicContent, minInvestment, hoursAvailable, msg.sender);
        address payable newTopicAddress = address(uint160(address(newTopic)));
        newTopicAddress.transfer(address(this).balance);
        
        //deployedTopics.push(address(newTopic)); //TODO: Remove
        bytes32 key = addressToBytes32(address(newTopic));
        topicSet.insert(key);
        deployedTopics[key] = address(newTopic);

        // In an attempt to only perform a single transaction, we add the topic right after creation.
        // IMPORTANT NOTE: Must have created reputation object using the reputation factory prior to creating this topic
        ReputationFactory reputationFactory = ReputationFactory(reputationFactoryAddress);
        address reputationAddress = reputationFactory.deployedReputations(msg.sender);
        Reputation(reputationAddress).addTopic(newTopicAddress, msg.sender);
        
        emit LogNewTopic(msg.sender, address(newTopic), minInvestment, hoursAvailable);

    }
    
    function markTopicAsCompleted(address topicAddress) public {
        require(msg.sender == topicAddress, 'Only the topic contract itself can complete the contract.');
        bytes32 key = addressToBytes32(topicAddress);
        removeDeployedTopic(topicAddress);
        completedTopicSet.insert(key);
        completedTopics[key] = topicAddress;
    }
    
    function removeDeployedTopic(address topicAddress) public {
        bytes32 key = addressToBytes32(topicAddress);
        topicSet.remove(key); // Note that this will fail automatically if the key doesn't exist
        delete deployedTopics[key];
        emit LogRemoveTopic(msg.sender, topicAddress, key);
    }
    
    function getDeployedTopic(uint index) public view returns(address) {
        bytes32 key = topicSet.keyAtIndex(index);
        require(topicSet.exists(key), "Can't get a topic that doesn't exist.");
        address topicAddress = deployedTopics[key];
        return(topicAddress);
    }
    

    function getNumberOfDeployedContracts() public view returns (uint) {
        return topicSet.count();
    }
    
    function getNumberOfCompletedContracts() public view returns (uint) {
        return completedTopicSet.count();
    }
    
    function convertKeyListToTopicList(bytes32[] memory keyList) internal view returns (address[] memory) {
        uint count = keyList.length;

        address[] memory topics = new address[](count);

        for (uint i = 0; i < keyList.length; i++) {
            topics[i] = deployedTopics[keyList[i]];
        }  
        return topics;
    }

    function getTopicsBetweenIndices(uint startIndex, uint endIndex) public view returns (address[] memory) {
        uint diff = endIndex - startIndex;
        uint[] memory indices = new uint[](diff); 
        
        for (uint i = 0; i < diff; i++) {
            indices[i] = startIndex + i;
        }
        bytes32[] memory keys = topicSet.keysAtIndices(indices);

        return convertKeyListToTopicList(keys);
    }
    
    function getCompletedTopicsBetweenIndices(uint startIndex, uint endIndex) public view returns (address[] memory) {
        uint diff = endIndex - startIndex;
        uint[] memory indices = new uint[](diff); 
        
        for (uint i = 0; i < diff; i++) {
            indices[i] = startIndex + i;
        }
        bytes32[] memory keys = completedTopicSet.keysAtIndices(indices);

        return convertKeyListToTopicList(keys);
    } 
    
    function getTopicsAtIndices(uint[] memory indices) public view returns (address[] memory) {
        bytes32[] memory keys = topicSet.keysAtIndices(indices);
        return convertKeyListToTopicList(keys);
    }
}