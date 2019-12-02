import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  "0x4BE24Ebd7D7623456B0Dd3aaEF27039E2e176bc7"
);

export default instance;
