import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  "0x6A52f1A835eF74Cb26a9fafac78f95A6448702aC"
  // "0x34d3A9B38b4102fcf2C33d2c9096b0De3DEabe7c" // This has most of the work on it
);

export default instance;
