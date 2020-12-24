let Utils = artifacts.require("./Utils.sol");
let BountyApp = artifacts.require("./BountyApp.sol");

module.exports = async function(deployer) {
    await deployer.deploy(BountyApp);
    // deployer.link(BountyApp, Utils);
};
