const KnownOriginDigitalAsset = artifacts.require('KnownOriginDigitalAsset');

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = 'nbCbdzC6IG9CF6hmvAVQ';
let mnemonic = require('../mnemonic');

module.exports = function (deployer, network, accounts) {

  let _curatorAccount = accounts[0];
  let _developerAccount = accounts[1];

  // Load in other accounts for different networks
  if (network === 'ropsten' || network === 'rinkeby') {
    _developerAccount = new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraApikey}`, 2).getAddress();
  }

  console.log(`Running within network = ${network}`);
  console.log(`_curatorAccount = ${accounts[0]}`);
  console.log(`_developerAccount = ${_developerAccount}`);

  deployer.deploy(KnownOriginDigitalAsset, _curatorAccount);
};
