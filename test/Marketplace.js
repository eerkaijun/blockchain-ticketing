const Marketplace = artifacts.require("Marketplace");

contract("Marketplace", (accounts) => {
  let [owner, user] = accounts;
  let contractInstance;
  beforeEach(async() => {
    contractInstance = await Marketplace.new();
  });

  it("User should be able to buy ticket", async() => {
    await contractInstance.createTicket(3, "A01", {from:owner}); //first create a ticket
    //await contractInstance.setApprovalForAll(user, true, {from:owner});
    const result = await contractInstance.buyTicket(0, {from:user, value:3});
    assert.equal(result.receipt.status, true);
    const ownerAddress = await contractInstance.ticketToOwner(0);
    assert.equal(ownerAddress, user); //ownership is now trasferred to user
    const ticket = await contractInstance.tickets(0);
    assert.equal(ticket[0], 3, "ticket price is correct");
    assert.equal(ticket[1], "A01", "seat number is correct"); //metadata remain the same
  });


})
