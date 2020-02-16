import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  "0x6C141A0f5D7Eb04129746200De3475535537BE1a"
);

export default instance;
