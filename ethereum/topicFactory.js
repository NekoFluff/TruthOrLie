import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x5fCb7ABDF5fC53c2dEF8c86F97134bc044269e48"//process.env.topicFactoryAddress
);

export default instance;
