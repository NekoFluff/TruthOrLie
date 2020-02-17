import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  "0x29F1D6016D7952BCF16EE0Bf10Dc5c5E51511ba7"
);

export default instance;
