const Paymaster = artifacts.require("Paymaster");

module.exports = function(deployer) {
  deployer.deploy(Paymaster);
}
