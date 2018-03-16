const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = 'nbCbdzC6IG9CF6hmvAVQ';
let mnemonic = require('./mnemonic');

// Check gas prices before live deploy - https://ethgasstation.info/

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    }
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545, // - ganache
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraApikey}`);
      },
      network_id: 3,
      gas: 4075039, // default = 4712388
      gasPrice: 10000000000 // default = 100 gwei = 100000000000
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/${infuraApikey}`);
      },
      network_id: 4,
      gas: 3075039, // default = 4712388
      gasPrice: 10000000000 // default = 100 gwei = 100000000000
    }
  }
};
