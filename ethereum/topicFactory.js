import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0xC8171E5Cb6F894F20DE019908c87A97364aaA29E"//"0xC0D1E970cA2C36F5Ba4600626Bf230B53611606B"//process.env.topicFactoryAddress
);

export default instance;
