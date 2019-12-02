import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x850C6F8EA8A223808Ad296556D50f92be6FbD787"
);

export default instance;
