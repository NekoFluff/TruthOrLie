import web3 from "./web3";
import TopicAssigner from "./build/TopicAssigner.json";

const instance = new web3.eth.Contract(
  TopicAssigner.abi,
  "0x34aB39DF590D4B9bBfB42DB34d8050431BD452ff"//process.env.topicAssignerAddress
);

export default instance;
