const KnownOriginDigitalAsset = artifacts.require('KnownOriginDigitalAsset');

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = 'nbCbdzC6IG9CF6hmvAVQ';
let mnemonic = require('../mnemonic');

module.exports = function (deployer, network, accounts) {

  let _commissionAccount = accounts[1];
  let _contractDeveloper = accounts[2];

  // Load in other accounts for different networks
  if (network === 'ropsten' || network === 'rinkeby') {
    _commissionAccount = new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraApikey}`, 1).getAddress();
    _contractDeveloper = new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraApikey}`, 2).getAddress();
  }

  console.log(`Running within network = ${network}`);
  console.log(`_creatorAccount = ${accounts[0]}`);
  console.log(`_commissionAccount = ${_commissionAccount}`);
  console.log(`_contractDeveloper = ${_contractDeveloper}`);

  deployer.deploy(KnownOriginDigitalAsset, _commissionAccount, _contractDeveloper);
};
