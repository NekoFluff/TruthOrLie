import web3 from "./web3";
import TopicAssigner from "./build/TopicAssigner.json";

const instance = new web3.eth.Contract(
  TopicAssigner.abi,
  "0xb0aa44eA59549D1Aff25DC3C83e03051F7aC6593"//process.env.topicAssignerAddress
);

export default instance;
