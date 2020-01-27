import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  "0x2a705700f9DeBcB867fE1e29C564513F1e9E4BDc"
);

export default instance;
