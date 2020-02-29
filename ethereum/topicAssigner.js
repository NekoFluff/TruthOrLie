import web3 from "./web3";
import TopicAssigner from "./build/TopicAssigner.json";

const instance = new web3.eth.Contract(
  TopicAssigner.abi,
  "0xe4640a8bA2E525b674Ad8a77Fec39cA7B825b2eC"//"0x9c7BEfda12a4514F7A8699c5564e512e1782561f"//process.env.topicAssignerAddress
);

export default instance;
