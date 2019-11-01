import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  "0x336e5aB44E5F90D1564c7cF71633C81b3A669215"
);

export default instance;
