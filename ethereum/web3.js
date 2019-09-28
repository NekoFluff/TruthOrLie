import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // On the browser
  web3 = new Web3(window.web3.currentProvider);
} else {
  // On the server (or if the user doesn't use metamask with their browser)
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/097a68f1563e4f988a17962bc97df336"
  );
  web3 = new Web3(provider);
}

export default web3;
