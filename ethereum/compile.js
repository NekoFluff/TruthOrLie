const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractsFolder = path.resolve(__dirname, "contracts");
let sources = {};
fs.readdirSync(contractsFolder).forEach(file => {
  let campaignPath = path.resolve(__dirname, "contracts", file);
  sources[file] = {
    content: fs.readFileSync(campaignPath, "UTF-8")
  };
});

var input = {
  language: "Solidity",
  sources: sources,
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"]
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
// console.log(output.contracts['CampaignFactory.sol']['CampaignFactory'].evm.bytecode.object);
fs.ensureDirSync(buildPath);

Object.keys(output.contracts).forEach(file => {
  Object.keys(output.contracts[file]).forEach(contract => {
    fs.outputJsonSync(
      path.resolve(buildPath, contract + ".json"),
      output.contracts[file][contract]
    );
  });
});
