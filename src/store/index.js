import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    netIdString: '',
    defaultEthWallet: '',
    web3: null,
    contract: null,
    account: null,
    eth: null,

    contractName: '',
    contractSymbol: '',
    curatorAddress: null,
    totalSupply: null,
    totalPurchaseValueInWei: null,
    totalNumberOfPurchases: null,
  },
  getters: {},
  mutations: {
    //////////////
    //////////////
    //////////////
    curatorAddress(state, curatorAddress) {
      state.curatorAddress = curatorAddress;
    },
    totalSupply(state, totalSupply) {
      state.totalSupply = totalSupply;
    },
    totalPurchases(state, {totalPurchaseValueInWei, totalNumberOfPurchases}) {
      state.totalPurchaseValueInWei = totalPurchaseValueInWei;
      state.totalNumberOfPurchases = totalNumberOfPurchases;
    },
    contractDetails(state, {name, symbol}) {
      state.contractSymbol = symbol;
      state.contractName = name;
    },
    //////////////
    //////////////
    //////////////
    setAccount(state, account) {
      state.account = account;
    },
    setEth(state, eth) {
      state.eth = eth;
    },
    setWeb3(state, web3) {
      state.web3 = web3;
    },
    setKOContract(state, contract) {
      state.contract = contract;
    },
    setNetworkId(state, netIdString) {
      state.netIdString = netIdString;
    },
    setDefaultEthWallet(state, walletAddress) {
      state.defaultEthWallet = walletAddress;
    }
  },
  actions: {}
});

export default store;
