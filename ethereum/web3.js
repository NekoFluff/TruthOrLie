import Web3 from "web3";
import { Router } from "../routes";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // On the browser
  console.log("Using browser web3");
  web3 = new Web3(window.web3.currentProvider);
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', function () {
      Router.replace('/');// accounts[0]!
    })
  }


} else {
  // On the server (or if the user doesn't use metamask with their browser)
  console.log("Using rinkeby.infura web3");

  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/18ff1d353a884068a84b06afb9b5fcf3"
  );
  web3 = new Web3(provider);

}

export default web3;
