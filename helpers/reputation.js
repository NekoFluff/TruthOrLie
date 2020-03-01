import reputationFactory from "../ethereum/reputationFactory";
import Reputation from "../ethereum/reputation";

export const retrieveReputationAddress = async userAddress => {
  const reputationAddress = await reputationFactory.methods
    .deployedReputations(userAddress)
    .call();
  return reputationAddress;
};

export const retrieveReputation = async userAddress => {
  const reputationAddress = await retrieveReputationAddress(userAddress);

  // Retrieve reputation for user
  // console.log("The Rep Address: " + reputationAddress);
  if (isValidReputationAddress(reputationAddress)) {
    const reputationContract = Reputation(reputationAddress);
    const rep = await reputationContract.methods.rep().call();
    return { reputationAddress, rep };
  }
};

export const isValidReputationAddress = repAddress => {
  // console.log("The Rep Address XXX: " + repAddress);
  return (
    repAddress != "0x0000000000000000000000000000000000000000" &&
    repAddress != null &&
    repAddress != ""
  );
};
