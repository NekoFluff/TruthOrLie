import web3 from "./web3";
import TopicAssigner from "./build/TopicAssigner.json";

const instance = new web3.eth.Contract(
  TopicAssigner.abi,
  "0x858Cc0f34B4C1f57DE62e5Fc1E829A2677632285"//process.env.topicAssignerAddress
);

export default instance;
