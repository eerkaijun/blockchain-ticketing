const TicketsFactory = artifacts.require("TicketsFactory");
const utils = require("./helpers/utils");

contract("TicketsFactory", (accounts) => {
  let [owner, user] = accounts;
  let contractInstance;
  beforeEach(async() => {
    contractInstance = await TicketsFactory.new();
  });

  it("Owner should be able to create tickets", async() => {
    const result = await contractInstance.createTicket({from:owner});
    assert.equal(result.receipt.status, true);
    const ownerAddress = await contractInstance.ownerOf(1);
    assert.equal(ownerAddress, owner, "minted tokens now owned by owner");
    const balance = await contractInstance.balanceOf(owner);
    assert.equal(balance, 1, "owner only hold one token")
    //const ticket = await contractInstance.tickets(0);
    //assert.equal(ticket[0], 3, "ticket price is correct");
    //assert.equal(ticket[1], "A01", "seat number is correct");
  });

  it("Normal user should not be able to create tickets", async() => {
    await utils.shouldThrow(contractInstance.createTicket(3, "A01", {from:user}));
  });
})
