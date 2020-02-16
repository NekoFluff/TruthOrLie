import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x8d2116eAeb9cF1921980f9f3f09b45864137C693"//process.env.topicFactoryAddress
);

export default instance;
