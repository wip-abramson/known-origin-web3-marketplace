// import contract from 'truffle-contract';
import Web3 from 'web3';
import store from '../store/index';

// TODO re-enable

// const getNetIdString = async () => {
//   const id = await store.web3.eth.net.getId();
//   switch (id) {
//     case 1:
//       return 'Main Ethereum Network';
//     case 3:
//       return 'Ropsten Test Network';
//     case 4:
//       return 'Rinkeby Test Network';
//     case 42:
//       return 'Kovan Test Network';
//     case 'loading':
//       return undefined;
//     // Will be some random number when connected locally
//     default:
//       return 'Local Test Net';
//   }
// };
//
// const getDefaultEthWallet = () =>
//   new Promise((resolve, reject) => {
//     web3.eth.getAccounts((err, res) => {
//       if (!err) return resolve(res[0]);
//       reject(err);
//     });
//   });
//
// export {getDefaultEthWallet, getNetIdString};
