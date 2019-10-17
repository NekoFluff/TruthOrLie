import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x74FD7F04b022Aa56222c272D23F57c306520aE32"
);

export default instance;
