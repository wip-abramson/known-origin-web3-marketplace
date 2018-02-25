
// TODO merge contracts into one

const KnownOriginDigitalAsset = artifacts.require("KnownOriginDigitalAsset");

module.exports = function (deployer, network, accounts) {
  let _curatorAccount = accounts[0];
  let _commissionAccount = accounts[1];
  let _contractDeveloper  = accounts[2];

  deployer.deploy(KnownOriginDigitalAsset, _commissionAccount, _contractDeveloper);
};
