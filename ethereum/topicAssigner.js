import web3 from "./web3";
import TopicAssigner from "./build/TopicAssigner.json";

const instance = new web3.eth.Contract(
  TopicAssigner.abi,
  "0xf17fa04346Ae038EF380D526738f4848b741d234"//process.env.topicAssignerAddress
);

export default instance;
