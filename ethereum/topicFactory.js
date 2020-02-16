import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x1D43F63045A2887CCe3B907a182C7BBE7e499Edb"//process.env.topicFactoryAddress
);

export default instance;
