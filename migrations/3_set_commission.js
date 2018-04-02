const Promise = require('bluebird');

const KnownOriginDigitalAsset = artifacts.require('KnownOriginDigitalAsset');


module.exports = function (deployer, network, accounts) {

  let _curatorAccount = accounts[0];

  deployer
    .then(() => KnownOriginDigitalAsset.deployed())
    .then((instance) => {

      console.log(`Setting commission structures...`);

      // editionTypeToCommission["DIG"] = CommissionStructure({curator : 12, developer : 12});
      // editionTypeToCommission["PHY"] = CommissionStructure({curator : 24, developer : 15});

      return Promise.all([
        instance.updateCommission("DIG", 12, 12, {from: _curatorAccount}),
        instance.updateCommission("PHY", 24, 15, {from: _curatorAccount})
      ]);
    });

};


