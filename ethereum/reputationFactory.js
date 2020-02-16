import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  "0x87EBa262e33828Efb60EeAB6c3C8b0b17d2A154F"
);

export default instance;
