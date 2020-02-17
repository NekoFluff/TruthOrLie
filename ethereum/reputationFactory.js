import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  "0x29967b2D69b406f31A1fF51CAAb7C28e1e5C7b1E"
);

export default instance;
