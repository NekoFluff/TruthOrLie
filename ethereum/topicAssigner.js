import web3 from "./web3";
import TopicAssigner from "./build/TopicAssigner.json";

const instance = new web3.eth.Contract(
  TopicAssigner.abi,
  "0xCd06CB1Dce6d391e78a3B4aEcB11e5ced53B98cB"//"0x9c7BEfda12a4514F7A8699c5564e512e1782561f"//process.env.topicAssignerAddress
);

export default instance;
