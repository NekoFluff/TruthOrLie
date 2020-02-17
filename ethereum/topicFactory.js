import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x9763E0bf092A864Cc4F087BacDe0606743B39cc0"//process.env.topicFactoryAddress
);

export default instance;
