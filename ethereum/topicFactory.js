import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0xEC94d51442921cC699Af052a2E8A2753597Af604"
);

export default instance;
