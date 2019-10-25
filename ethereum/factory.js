import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x27C8aDF666103c992489B74C97Dea7C7795AE646"
  // "0x34d3A9B38b4102fcf2C33d2c9096b0De3DEabe7c" // This has most of the work on it
);

export default instance;
