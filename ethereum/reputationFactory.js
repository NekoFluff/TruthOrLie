import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  "0x3ea958f93d231c3c32E4d8848972a7D9094f8aC7"//"0x01A6ba50C0031bb684E65589F2eF5F078B19fD4a"
);

export default instance;
