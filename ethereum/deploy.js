const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledTopicFactory = require("./build/TopicFactory.json");
const compiledReputationFactory = require("./build/ReputationFactory.json");

const mnemonic =
  "screen ugly basket extend hole nurse first hood permit adult payment defense";

const provider = new HDWalletProvider(
  mnemonic,
  "https://rinkeby.infura.io/v3/18ff1d353a884068a84b06afb9b5fcf3"
);

const web3 = new Web3(provider);

const deploy = async (contractName, contractJson) => {
  // Get a list of the accounts available
  const accounts = await web3.eth.getAccounts();

  console.log("Available accounts:", accounts);
  console.log("Attempting to deploy from account #0:", accounts[0]);

  // Create new instance of the contract
  const contractInstance = await new web3.eth.Contract(contractJson.abi)
    .deploy({
      data: "0x" + contractJson.evm.bytecode.object,
      arguments: []
    })
    .send({
      from: accounts[0]
    }); // remove 'gas'

  console.log(
    "Address of new " + contractName + " contract:",
    contractInstance.options.address
  );
};

deploy("Topic Factory", compiledTopicFactory).then(() => {
  console.log("Finished Topic Factory Deployment");
});
deploy("Reputation Factory", compiledReputationFactory).then(() => {
  console.log("Finished Reputation Factory Deployment");
});
