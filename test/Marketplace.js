const Marketplace = artifacts.require("Marketplace");
const utils = require("./helpers/utils");

contract("Marketplace", (accounts) => {
  let [owner, user] = accounts;
  let contractInstance;
  beforeEach(async() => {
    contractInstance = await Marketplace.new();
  });

  it("User should be able to buy ticket", async() => {
    await contractInstance.createTicket({from:owner}); //first create a ticket
    const result = await contractInstance.buyTicket(1, {from:user, value: web3.utils.toWei('4','ether')});
    assert.equal(result.receipt.status, true);
    const contractBalance = await web3.eth.getBalance(contractInstance.address);
    assert.equal(contractBalance, web3.utils.toWei('4','ether'), "contract received fund");
    const ownerAddress = await contractInstance.ownerOf(1);
    assert.equal(ownerAddress, user, "minted tokens now owned by user");
    const balance = await contractInstance.balanceOf(owner);
    assert.equal(balance, 0, "owner doesn't hold any tokens anymore");
  });

  it("User should not be able to buy ticket below the price", async() => {
    await contractInstance.createTicket({from:owner}); //first create a ticket
    await utils.shouldThrow(contractInstance.buyTicket(1, {from:user, value: web3.utils.toWei('2','ether')}));
  });

  it("Owner should be able to withdraw money from contract", async() => {
    await contractInstance.createTicket({from:owner});
    const result = await contractInstance.buyTicket(1, {from:user, value: web3.utils.toWei('3','ether')});
    assert.equal(result.receipt.status, true);
    await contractInstance.withdraw({from:owner});
    const balance = await web3.eth.getBalance(contractInstance.address);
    assert.equal(balance, 0, "money deposited into owner's account");
  })

  it("User should not be able to withdraw money from contract", async() => {
    await contractInstance.createTicket({from:owner});
    const result = await contractInstance.buyTicket(1, {from:user, value: web3.utils.toWei('3','ether')});
    await utils.shouldThrow(contractInstance.withdraw({from:user}));
  });

})
