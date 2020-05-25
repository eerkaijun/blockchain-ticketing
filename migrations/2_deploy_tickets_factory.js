const TicketsFactory = artifacts.require("TicketsFactory");

module.exports = function(deployer) {
  deployer.deploy(TicketsFactory);
};
