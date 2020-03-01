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

const MNEMONIC = process.env.MNEMONIC;
const infuraLink = process.env.infuraLink;
const provider = new HDWalletProvider(
  MNEMONIC,
  infuraLink
);

const web3 = new Web3(provider);


const getPrimaryAccount = async () => {
  // Get a list of the accounts available
  const x =  await web3.eth.getBalance('0xe4640a8bA2E525b674Ad8a77Fec39cA7B825b2eC');

  // console.log("Available accounts:", accounts);
  console.log(x);
  process.exit(0);
}

getPrimaryAccount();