const assert = require("assert");
const Web3 = require("web3");
const web3 = new Web3("HTTP://127.0.0.1:7545");

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  // console.log(compiledCampaign.abi);
  // console.log(compiledCampaign.evm.bytecode.object);

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: "0x" + compiledFactory.evm.bytecode.object,
      arguments: []
    })
    .send({ from: accounts[0], gas: 3000000 }); // remove 'gas'
  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000"
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1]
    });
    await campaign.methods.contribute().send({
      value: "300",
      from: accounts[2]
    });

    const isContributor = await campaign.methods
      .contributors(accounts[1])
      .call();
    const isContributor2 = await campaign.methods
      .contributors(accounts[2])
      .call();
    assert(accounts[1], isContributor);
    assert(accounts[2], isContributor2);
  });

  it("requires minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "50",
        from: accounts[0]
      });

      assert(false);
    } catch (err) {
      assert.equal(
        err.actual,
        undefined,
        "Contract does not prevent user from contributing less than the required amount."
      );
    }
  });

  it("allows a manager to make a payment request if there is enough money", async () => {
    await campaign.methods.contribute().send({
      value: "300",
      from: accounts[2]
    });

    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000"
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy batteries", request.description);
  });

  it("processes requests successfully", async () => {
    await campaign.methods.contribute().send({
      value: web3.utils.toWei("10", "ether"),
      from: accounts[1]
    });

    await campaign.methods
      .createRequest(
        "Buy batteries",
        web3.utils.toWei("5", "ether"),
        accounts[2]
      )
      .send({
        from: accounts[0],
        gas: "1000000"
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: "1000000"
    });

    let balancePrior = await web3.eth.getBalance(accounts[2]);
    balancePrior = web3.utils.fromWei(balancePrior, "ether");
    balancePrior = parseFloat(balancePrior);

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000"
    });

    let balanceAfter = await web3.eth.getBalance(accounts[2]);
    balanceAfter = web3.utils.fromWei(balanceAfter, "ether");
    balanceAfter = parseFloat(balanceAfter);

    assert(balanceAfter - balancePrior >= 4);
    console.log(
      "Difference in balance for account#2: " + (balanceAfter - balancePrior)
    );
  });
});
