import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x82aBD8D15f8B0bcF93E1b77e2AfAF1d0dd7f2C21" //"0x75429bddaC997AB9bEB07a4b5A1F80F3e533C7a0"////"0xC0D1E970cA2C36F5Ba4600626Bf230B53611606B"//process.env.topicFactoryAddress
);

export default instance;
