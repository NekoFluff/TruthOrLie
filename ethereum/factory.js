import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x34d3A9B38b4102fcf2C33d2c9096b0De3DEabe7c"
);

export default instance;
