import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x70f61911DC6Ae71aB385Ea778541bdbCbff6cA21"
);

export default instance;
