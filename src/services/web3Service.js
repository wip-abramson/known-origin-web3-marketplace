// import contract from 'truffle-contract';
import Web3 from 'web3';
import store from '../store/index';

import Eth from "ethjs";
import KnownOriginDigitalAssetJSON from '../../build/contracts/KnownOriginDigitalAsset.json';

let web3;

// TODO load metamask properly
if (typeof web3 !== 'undefined') {
  console.log('Web3 injected browser: OK.');
  web3 = new Web3(web3.currentProvider);
} else {
  console.log('Web3 injected browser: Fail. You should consider trying MetaMask.')
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

// TODO switch this based on the network working with
const kodaAddress = "0x73e56d397E7e571C9FBB3DC9aE1D206851025908"

// TODO switch to use metamask
const eth = new Eth(new Eth.HttpProvider('https://ropsten.infura.io'));

// Get hold of the contract ABI and bind to contract at address
const KnownOriginDigitalAssetContract =
  eth
    .contract(KnownOriginDigitalAssetJSON.abi)
    .at(kodaAddress);

// Set various bits on the store for utility
store.commit('setWeb3', web3);
store.commit('setEth', eth);
store.commit('setAccount', web3.eth.accounts[0]);
store.commit('setKOContract', KnownOriginDigitalAssetContract);

KnownOriginDigitalAssetContract.curator().then((curatorAddress) => {
  store.commit("curatorAddress", curatorAddress)
});

KnownOriginDigitalAssetContract.totalSupply().then((totalSupply) => {
  store.commit("totalSupply", totalSupply[0])
});

Promise.all([KnownOriginDigitalAssetContract.name(), KnownOriginDigitalAssetContract.symbol()])
  .then((results) => {
    store.commit("contractDetails", {
      name: results[0][0],
      symbol: results[1][0]
    });
  });

Promise.all([KnownOriginDigitalAssetContract.totalPurchaseValueInWei(), KnownOriginDigitalAssetContract.totalNumberOfPurchases()])
  .then((results) => {
    store.commit("totalPurchases", {
      totalPurchaseValueInWei: results[0][0],
      totalNumberOfPurchases: results[1][0]
    });
  });

const getNetIdString = async () => {
  const id = await web3.eth.net.getId();
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
      return undefined;
    // Will be some random number when connected locally
    default:
      return 'Local Test Net';
  }
};

const getDefaultEthWallet = () =>
  new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, res) => {
      if (!err) return resolve(res[0]);
      reject(err);
    });
  });

export {getDefaultEthWallet, getNetIdString};
