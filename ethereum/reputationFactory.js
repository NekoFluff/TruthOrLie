import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  "0xaC76102Ce7Bc9c97E18F9022fc08b2AbF35695e7"//"0x01A6ba50C0031bb684E65589F2eF5F078B19fD4a"
);

export default instance;
