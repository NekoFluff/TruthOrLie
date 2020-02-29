import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x3931B7043F8b516C4C166b7AFBA2856B209AF46b"//"0xC0D1E970cA2C36F5Ba4600626Bf230B53611606B"//process.env.topicFactoryAddress
);

export default instance;
