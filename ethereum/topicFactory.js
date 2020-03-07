import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x82aBD8D15f8B0bcF93E1b77e2AfAF1d0dd7f2C21" // Rinkeby
  // "0x7fD78dD9eF88A712e2DB9851358aE315564c5957"
);

export default instance;
