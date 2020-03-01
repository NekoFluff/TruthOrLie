import web3 from "./web3";
import TopicAssigner from "./build/TopicAssigner.json";

const instance = new web3.eth.Contract(
  TopicAssigner.abi,
  "0xC892379cc24E34ac48430D2890d0Ccb9cfE1e97E" //"0x87f14bC254E0E552454d00e06504D3bC370517f2"////"0x9c7BEfda12a4514F7A8699c5564e512e1782561f"//process.env.topicAssignerAddress
);

export default instance;
