import web3 from "./web3";
import Topic from "./build/Topic.json";

export default address => {
  return new web3.eth.Contract(Topic.abi, address);
};
