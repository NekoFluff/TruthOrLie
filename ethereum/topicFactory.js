import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0xdCcc5E8FD9Fe0b59E7594bA1617212B8C77A6F22"
);

export default instance;
