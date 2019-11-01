import web3 from "./web3";
import Reputation from "./build/Reputation.json";

export default address => {
  return new web3.eth.Contract(Reputation.abi, address);
};
