import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  "0xC0e8de89661cC7C7c575a4176C82DedA093A3457"//"0x6ADC43a8A9C46a55B952fa3a0237343cd6f18C9e"////"0x01A6ba50C0031bb684E65589F2eF5F078B19fD4a"
);

export default instance;
