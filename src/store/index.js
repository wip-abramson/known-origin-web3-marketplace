import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions'
import * as mutations from './mutation-types'
import Eth from "ethjs";
import Web3 from 'web3'

import KnownOriginDigitalAssetJSON from '../../build/contracts/KnownOriginDigitalAsset.json';

Vue.use(Vuex);

// TODO switch this based on the network working with
const KODA_ADDRESS = "0x73e56d397E7e571C9FBB3DC9aE1D206851025908";

const store = new Vuex.Store({
  state: {
    // connectivity
    eth: null,
    account: null,

    // Contract specific
    contract: null,
    contractName: '',
    contractSymbol: '',
    curatorAddress: null,
    totalSupply: null,
    totalPurchaseValueInWei: null,
    totalNumberOfPurchases: null,

    // netIdString: '',
    // defaultEthWallet: '',
    // web3: null,
  },
  getters: {},
  mutations: {
    [mutations.SET_CURATOR_ADDRESS](state, curatorAddress) {
      state.curatorAddress = curatorAddress;
    },
    [mutations.SET_TOTAL_SUPPLY](state, totalSupply) {
      state.totalSupply = totalSupply;
    },
    [mutations.SET_TOTAL_PURCHASED](state, {totalPurchaseValueInWei, totalNumberOfPurchases}) {
      state.totalPurchaseValueInWei = totalPurchaseValueInWei;
      state.totalNumberOfPurchases = totalNumberOfPurchases;
    },
    [mutations.SET_CONTRACT_DETAILS](state, {name, symbol}) {
      state.contractSymbol = symbol;
      state.contractName = name;
    },
    [mutations.SET_ETHJS](state, eth) {
      state.eth = eth;
    },
    [mutations.SET_CONTRACT](state, contract) {
      state.contract = contract
    },
    [mutations.SET_ACCOUNT](state, account) {
      state.account = account
    },
  },
  actions: {
    [actions.INIT_ETHJS]({commit, dispatch, state}) {
      console.log("INIT_ETHJS ACTION");

      // Default to ropsten/infrua for now
      let eth = new Eth(new Eth.HttpProvider('https://ropsten.infura.io'));

      // TODO enable meta mask support
      // Enable MetaMask support:
      if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
        eth.setProvider(window.web3.currentProvider);
      }

      commit(mutations.SET_ETHJS, eth);

      store.dispatch(actions.INIT_KODA_CONTRACT)
    },
    [actions.INIT_KODA_CONTRACT]({commit, dispatch, state}) {
      console.log("INIT_KODA_CONTRACT ACTION");

      let KODA_CONTRACT = state.eth
        .contract(KnownOriginDigitalAssetJSON.abi)
        .at(KODA_ADDRESS);

      // TODO how to switch this based on network?
      commit(mutations.SET_CONTRACT, KODA_CONTRACT);

      // Refresh latest contract details
      store.dispatch(actions.REFRESH_CONTRACT_DETAILS);

      // Refresh account reference
      store.dispatch(actions.REFRESH_ACCOUNT);
    },
    [actions.REFRESH_CONTRACT_DETAILS]({commit, dispatch, state}) {
      console.log("REFRESH_CONTRACT_DETAILS ACTION");

      state.contract.curator().then((curatorAddress) => {
        // TODO should I mutate state directly here or use commit with a handler?
        commit(mutations.SET_CURATOR_ADDRESS, curatorAddress)
      });

      state.contract.totalSupply().then((totalSupply) => {
        commit(mutations.SET_TOTAL_SUPPLY, totalSupply[0])
      });

      Promise.all([state.contract.name(), state.contract.symbol()])
        .then((results) => {
          commit(mutations.SET_CONTRACT_DETAILS, {
            name: results[0][0], symbol: results[1][0]
          });
        });

      Promise.all([state.contract.totalPurchaseValueInWei(), state.contract.totalNumberOfPurchases()])
        .then((results) => {
          commit(mutations.SET_TOTAL_PURCHASED, {
            totalPurchaseValueInWei: results[0][0], totalNumberOfPurchases: results[1][0]
          });
        });
    },
    [actions.REFRESH_ACCOUNT]({commit, dispatch, state}) {
      state.eth.accounts()
        .then((accounts) => {
          console.log("Found accounts", accounts);
          commit(mutations.SET_ACCOUNT, accounts[0]);
        })
        .catch((error) => console.log(error));
    }
  }
});

export default store;
