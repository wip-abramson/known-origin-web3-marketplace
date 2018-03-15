const KnownOriginDigitalAsset = artifacts.require('KnownOriginDigitalAsset');


module.exports = function (deployer, network, accounts) {

  let _commissionAccount = accounts[1];
  let _contractDeveloper = accounts[2];

  console.log(`Running within network = ${network}`);

  deployer.deploy(KnownOriginDigitalAsset, _commissionAccount, _contractDeveloper)

};
