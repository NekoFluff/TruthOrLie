import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0xAe9685E1191e257259030e2471F6d9CA2Ce736b6"
);

export default instance;
