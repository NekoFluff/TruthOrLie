
const TopicFactory = artifacts.require("TopicFactory");
const ReputationFactory = artifacts.require("ReputationFactory");
const TopicAssigner = artifacts.require("TopicAssigner");

module.exports = function(deployer) {
  deployer.then(async () => {
    const repInstance = await deployer.deploy(ReputationFactory, {gas: 5000000, gasPrice: 1200000000});
    const topicFactoryInstance = await deployer.deploy(TopicFactory, ReputationFactory.address, {gas: 5000000, gasPrice: 1200000000});
    await repInstance.updateTopicFactoryAddress(TopicFactory.address);
    console.log("Updated Topic Factory address in Reputation Factory");
    await deployer.deploy(TopicAssigner, TopicFactory.address, {gas: 5000000, gasPrice: 1200000000});
    await topicFactoryInstance.updateTopicAssignerAddress(TopicAssigner.address);
    console.log("Updated Topic Assigner address in Topic Factory");
  })
};
