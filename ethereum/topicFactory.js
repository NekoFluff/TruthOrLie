import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0xf4A0314501355DEb5C9D4D26659A0AF695eE90D3"//process.env.topicFactoryAddress
);

export default instance;
