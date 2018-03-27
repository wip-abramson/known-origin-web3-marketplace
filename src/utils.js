const getNetIdString = () => {
  return window.web3.eth.net.getId()
    .then((id) => {

      console.log(`Running on network ID ${id}`);

      switch (id) {
        case 1:
          return 'Main Ethereum Network';
        case 3:
          return 'Ropsten Test Network';
        case 4:
          return 'Rinkeby Test Network';
        case 42:
          return 'Kovan Test Network';
        case 'loading':
          return 'loading..';
        // Will be some random number when connected locally
        default:
          return 'Local Test Net';
      }
    });
};

const getEtherscanAddress = () => {
  return window.web3.eth.net.getId()
    .then((id) => {
      switch (id) {
        case 1:
          return 'http://etherscan.io';
        case 3:
          return 'http://ropsten.etherscan.io';
        case 4:
          return 'http://rinkeby.etherscan.io';
        case 42:
          return 'http://kovan.etherscan.io';
        default:
          return '';
      }
    });
};

export {
  getNetIdString,
  getEtherscanAddress,
};
