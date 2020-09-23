const TicketsFactory = artifacts.require("TicketsFactory");
const Marketplace = artifacts.require("Marketplace");

module.exports = function(deployer) {
  deployer.deploy(TicketsFactory);
  deployer.deploy(Marketplace);
};
