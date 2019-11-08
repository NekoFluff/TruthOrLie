import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  "0x0604F9a0026613175C1A38a51e090aA96BB4e8B0"
);

export default instance;
