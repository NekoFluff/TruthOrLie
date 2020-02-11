import web3 from "./web3";
import TopicAssigner from "./build/TopicAssigner.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x6f38984FD2D455A096750B663a639DfE00ef7B3b"
);

export default instance;
