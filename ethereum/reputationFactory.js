import web3 from "./web3";
import ReputationFactory from "./build/ReputationFactory.json";

const instance = new web3.eth.Contract(
  ReputationFactory.abi,
  //Rinkeby: "0xe4788966a6c478b8Bf1789031A36f15399Eb68a7"
  "0xdF5cA8834c8F79Faf9FE3CD69505d34b78E24F70"
);

export default instance;
