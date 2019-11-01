import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x999b9B01F965C7F2552a9FC442060c7a93AF71aA"
);

export default instance;
