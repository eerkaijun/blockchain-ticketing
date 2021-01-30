const Marketplace = artifacts.require("Marketplace");
const utils = require("./helpers/utils");

contract("Marketplace", (accounts) => {
  let [owner, user] = accounts;
  let contractInstance;
  beforeEach(async() => {
    contractInstance = await Marketplace.new();
  });

  it("User should be able to buy ticket when on sale", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await contractInstance.toggleSale(0, {from:owner});
    const result = await contractInstance.buyTicket(0, {from:user, value: web3.utils.toWei('3','ether')});
    assert.equal(result.receipt.status, true);
    const contractBalance = await web3.eth.getBalance(contractInstance.address);
    assert.equal(contractBalance, web3.utils.toWei('3','ether'), "contract received fund");
    const ownerAddress1 = await contractInstance.ownerOf(0);
    const ownerAddress2 = await contractInstance.owners(0);
    assert.equal(ownerAddress1, user, "minted tokens now owned by user");
    assert.equal(ownerAddress2, user, "minted tokens now owned by user");
    const balance = await contractInstance.balanceOf(owner);
    assert.equal(balance, 0, "owner doesn't hold any tokens anymore");
  });

  it("User should not be able to buy ticket not on sale", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await utils.shouldThrow(contractInstance.buyTicket(0, {from:user, value: web3.utils.toWei('3','ether')}));
  });

  it("User should not be able to buy ticket below the price", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await contractInstance.toggleSale(0, {from:owner});
    await utils.shouldThrow(contractInstance.buyTicket(0, {from:user, value: web3.utils.toWei('2','ether')}));
  });

  it("User should not be able to buy ticket after event started", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await contractInstance.toggleSale(0, {from:owner});
    await contractInstance.startEvent({from:owner});
    await utils.shouldThrow(contractInstance.buyTicket(0, {from:user, value: web3.utils.toWei('3','ether')}));
  });

  it("Seller should be able to withdraw money from contract", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await contractInstance.toggleSale(0, {from:owner});
    const result = await contractInstance.buyTicket(0, {from:user, value: web3.utils.toWei('3','ether')});
    assert.equal(result.receipt.status, true);
    await contractInstance.withdraw({from:owner});
  })

})
