import web3 from "./web3";
import TopicAssigner from "./build/TopicAssigner.json";

const instance = new web3.eth.Contract(
  TopicAssigner.abi,
  // "0xC892379cc24E34ac48430D2890d0Ccb9cfE1e97E" // Rinkeby
  "0xF067031675997B0a1d576bEdC8fCa65Dc8F9353F"
);

export default instance;
