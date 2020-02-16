if (process.env.NODE_ENV !== 'production') {
  const result = require('dotenv').config();
  if (result.error) {
    throw result.error
  }
}

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledTopicFactory = require("./build/TopicFactory.json");
const compiledReputationFactory = require("./build/ReputationFactory.json");
const compiledTopicAssigner = require("./build/TopicAssigner.json");

const mnemonic = process.env.mnemonic;
console.log("Using mnemonic: " + mnemonic);

const provider = new HDWalletProvider(
  mnemonic,
  "https://rinkeby.infura.io/v3/18ff1d353a884068a84b06afb9b5fcf3"
);

const web3 = new Web3(provider);

const getPrimaryAccount = async () => {
    // Get a list of the accounts available
    const accounts = await web3.eth.getAccounts();

    // console.log("Available accounts:", accounts);
    console.log("Retrieved Account #0:", accounts[0]);
    return accounts[0]
}

const deploy = async (account, contractName, contractJson, arguments = []) => {
  // Create new instance of the contract
  const contractInstance = await new web3.eth.Contract(contractJson.abi)
    .deploy({
      data: "0x" + contractJson.evm.bytecode.object,
      arguments: arguments
    })
    .send({
      from: account,
      gas: 5000000
    }); // remove 'gas'

  console.log(
    "Address of new " + contractName + " contract:",
    contractInstance.options.address
  );

  return contractInstance;
};

const deployAll = async () => {
  try {
    const account = await getPrimaryAccount();
    const reputationFactory = await deploy(account, "Reputation Factory", compiledReputationFactory)
    console.log("Finished Reputation Factory Deployment");
    
    const topicFactory = await deploy(account, "Topic Factory", compiledTopicFactory, [reputationFactory.options.address])
    console.log("Finished Topic Factory Deployment");
    
    const topicAssigner = await deploy(account, "Topic Assigner", compiledTopicAssigner, [topicFactory.options.address])
    console.log("Finished Topic Assigner Deployment");

    await topicFactory.methods
      .updateTopicAssignerAddress(topicAssigner.options.address)
      .send({
        from: account,
        gas: 5000000
      }); // remove 'gas'
    console.log("Updated reverse link from TopicFactory Smart Contract to TopicAssigner smart contract")

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

deployAll();
