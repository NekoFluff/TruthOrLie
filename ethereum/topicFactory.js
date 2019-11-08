import web3 from "./web3";
import TopicFactory from "./build/TopicFactory.json";

const instance = new web3.eth.Contract(
  TopicFactory.abi,
  "0x60de693775A9E9DD63c178b5cD25133AEDe2E8a1"
);

export default instance;
