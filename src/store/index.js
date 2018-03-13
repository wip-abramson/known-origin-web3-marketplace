import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions'
import * as mutations from './mutation-types'
import _ from 'lodash'
import Web3 from 'web3'
import axios from 'axios'
import artistData from './artist-data'
import createLogger from 'vuex/dist/logger'
import {getNetIdString} from "../utils";

import {KnownOriginDigitalAsset} from '../contracts/index'

const utils = require('../utils');

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createLogger()],
  state: {
    // connectivity
    account: null,
    accountBalance: null,
    currentNetwork: null,
    assetsPurchasedByAccount: [],

    // contract metadata
    contractName: '',
    contractSymbol: '',

    // contract totals
    totalSupply: null,
    totalPurchaseValueInWei: null,
    totalNumberOfPurchases: null,
    totalPurchaseValueInEther: null,

    // contract addresses
    curatorAddress: null,
    commissionAddress: null,
    contractDeveloperAddress: null,

    // non-contract data
    artists: artistData,
    assets: [],
    assetsByEditions: [],
    assetsByArtists: []
  },
  getters: {
    assetsForEdition: (state) => (edition) => {
      return state.assets.filter((asset) => asset.edition === edition);
    },
    firstAssetForEdition: (state) => (edition) => {
      return _.head(state.assets.filter((asset) => asset.edition === edition));
    },
    assetById: (state) => (tokenId) => {
      return _.find(state.assets, (asset) => asset.id.toString() === tokenId.toString());
    },
  },
  mutations: {
    [mutations.SET_COMMISSION_ADDRESSES](state, {curatorAddress, commissionAddress, contractDeveloperAddress}) {
      state.curatorAddress = curatorAddress;
      state.commissionAddress = commissionAddress;
      state.contractDeveloperAddress = contractDeveloperAddress;
    },
    [mutations.SET_ASSETS](state, {assets, assetsByEditions, assetsByArtists}) {
      Vue.set(state, 'assets', assets);
      Vue.set(state, 'assetsByEditions', assetsByEditions);
      Vue.set(state, 'assetsByArtists', assetsByArtists);
    },
    [mutations.SET_ARTISTS](state, {artists}) {
      state.artists = artists;
    },
    [mutations.SET_ASSETS_PURCHASED_FROM_ACCOUNT](state, tokens) {
      Vue.set(state, 'assetsPurchasedByAccount', tokens);
    },
    [mutations.SET_TOTAL_PURCHASED](state, {totalPurchaseValueInWei, totalNumberOfPurchases, totalPurchaseValueInEther}) {
      state.totalPurchaseValueInWei = totalPurchaseValueInWei;
      state.totalNumberOfPurchases = totalNumberOfPurchases;
      state.totalPurchaseValueInEther = totalPurchaseValueInEther;
    },
    [mutations.SET_CONTRACT_DETAILS](state, {name, symbol, totalSupply}) {
      state.totalSupply = totalSupply;
      state.contractSymbol = symbol;
      state.contractName = name;
    },
    [mutations.SET_ACCOUNT](state, {account, accountBalance}) {
      state.account = account;
      state.accountBalance = accountBalance;
      store.dispatch(actions.GET_ASSETS_PURCHASED_FOR_ACCOUNT);
    },
    [mutations.SET_CURRENT_NETWORK](state, currentNetwork) {
      state.currentNetwork = currentNetwork
    },
  },
  actions: {
    [actions.GET_ASSETS_PURCHASED_FOR_ACCOUNT]({commit, dispatch, state}) {
      KnownOriginDigitalAsset.deployed()
        .then((contract) => {
          return contract.getOwnerTokens(state.account)
            .then((tokens) => {
              commit(mutations.SET_ASSETS_PURCHASED_FROM_ACCOUNT, tokens);
            });
        })
        .catch((e) => {
          console.error(e);
          // TODO handle errors
        });
    },
    [actions.GET_CURRENT_NETWORK]({commit, dispatch, state}) {
      getNetIdString()
        .then((currentNetwork) => {
          commit(mutations.SET_CURRENT_NETWORK, currentNetwork);
        });
    },
    [actions.INIT_APP]({commit, dispatch, state}, account) {
      web3.eth.getAccounts()
        .then((accounts) => {
          // TODO add refresh cycle / timeout

          let account = accounts[0];

          // init the KODA contract
          store.dispatch(actions.REFRESH_CONTRACT_DETAILS);

          return web3.eth.getBalance(account)
            .then((balance) => {

              let accountBalance = Web3.utils.fromWei(balance);

              // store the account details
              commit(mutations.SET_ACCOUNT, {account, accountBalance});
            });
        });
    },
    [actions.GET_ALL_ASSETS]({commit, dispatch, state}) {

      const lookupIPFSData = (hash) => {
        // TODO handle multiaddress meta

        // Conforms to existing IPFS meta structure
        let name = axios.get(`https://ipfs.infura.io/ipfs/${hash}/name`);
        let description = axios.get(`https://ipfs.infura.io/ipfs/${hash}/description`);
        let otherMeta = axios.get(`https://ipfs.infura.io/ipfs/${hash}/other`);
        let lowResImg = `https://ipfs.infura.io/ipfs/${hash}/image`;

        return Promise.all([name, description, otherMeta])
          .then((results) => {
            return {
              name: results[0].data,
              description: results[1].data,
              otherMeta: results[2].data,
              lowResImg: lowResImg
            }
          });
      };

      const lookupAssetInfo = (contract, index) => {
        return Promise.all([
          contract.assetInfo(index),
          contract.editionInfo(index)
        ])
          .then((results) => {
            let assetInfo = results[0];
            let editionInfo = results[1];

            let rawMeta = editionInfo[6];

            let fullAssetDetails = {
              id: assetInfo[0].toNumber(),
              owner: assetInfo[1].toString(),
              purchased: assetInfo[2].toNumber(),
              priceInWei: assetInfo[3].toString(),
              priceInEther: Web3.utils.fromWei(assetInfo[3].toString(), 'ether').valueOf(),
              auctionStartDate: assetInfo[4], // TODO handle auction start date

              type: editionInfo[1].toString(),
              edition: editionInfo[2].toString(),
              editionName: editionInfo[3].toString(),
              editionNumber: editionInfo[4].toNumber(),
              artist: editionInfo[5].toString(),
              rawMeta: rawMeta
            };

            return lookupIPFSData(rawMeta).then((ipfsMeata) => {
              // set IPFS lookup back on object
              _.set(fullAssetDetails, 'otherMeta', ipfsMeata.otherMeta);
              _.set(fullAssetDetails, 'description', ipfsMeata.description);
              _.set(fullAssetDetails, 'lowResImg', ipfsMeata.lowResImg);
              return fullAssetDetails;
            })
          })
      };

      KnownOriginDigitalAsset.deployed()
        .then((contract) => {
          let supply = _.range(0, state.totalSupply);

          return Promise.all(_.map(supply, (index) => lookupAssetInfo(contract, index)))
            .then((assets) => {

              let assetsByEditions = _.groupBy(assets, 'edition');
              let assetsByArtists = _.groupBy(assets, 'artistName');

              commit(mutations.SET_ASSETS, {
                assets: assets,
                assetsByEditions: assetsByEditions,
                assetsByArtists: assetsByArtists,
              })
            });
        });
    },
    [actions.REFRESH_CONTRACT_DETAILS]({commit, dispatch, state}) {
      KnownOriginDigitalAsset.deployed()
        .then((contract) => {

          Promise.all([contract.curator(), contract.commissionAccount(), contract.contractDeveloper()])
            .then((results) => {
              commit(mutations.SET_COMMISSION_ADDRESSES, {
                curatorAddress: results[0],
                commissionAddress: results[1],
                contractDeveloperAddress: results[2]
              })
            });

          Promise.all([contract.name(), contract.symbol(), contract.totalSupply()])
            .then((results) => {
              commit(mutations.SET_CONTRACT_DETAILS, {
                name: results[0],
                symbol: results[1],
                totalSupply: results[2].toString()
              });

              // We require totalSupply to lookup all ASSETS
              dispatch(actions.GET_ALL_ASSETS);
            });

          Promise.all([contract.totalPurchaseValueInWei(), contract.totalNumberOfPurchases()])
            .then((results) => {
              commit(mutations.SET_TOTAL_PURCHASED, {
                totalPurchaseValueInEther: Web3.utils.fromWei(results[0].toString(10), 'ether'),
                totalPurchaseValueInWei: results[0].toString(10),
                totalNumberOfPurchases: results[1].toString(10)
              });
            });
        });
    },
    [actions.PURCHASE_ASSET]: function ({commit, dispatch, state}, assetToPurchase) {
      console.log('assetToPurchase', assetToPurchase);

      Vue.$log.debug(`Attempting purchase of ${assetToPurchase.type} asset - ID ${assetToPurchase.id}`);

      if (assetToPurchase.type === 'physical') {

        // TODO handle physical purchases

      } else if (assetToPurchase.type === 'digital') {

        KnownOriginDigitalAsset.deployed()
          .then((contract) => {

            let _buyer = state.account;
            let _tokenId = assetToPurchase.id;

            let individualPurchaseEvent = contract.PurchasedWithEther({_tokenId: _tokenId, _buyer: _buyer}, {
              // TODO - does this work? - web3.eth.blockNumber ?
              fromBlock: 0,
              toBlock: 'latest' // wait until event comes through
            });

            individualPurchaseEvent.watch(function (error, result) {
              if (!error) {
                dispatch(actions.REFRESH_CONTRACT_DETAILS);
                dispatch(actions.GET_ASSETS_PURCHASED_FOR_ACCOUNT);
                individualPurchaseEvent.stopWatching();
              }
              // TODO re-enable UI
              console.error("Failure", e);
            });

            // TODO disable UI

            // TODO how to handle rejections e.g. invalid amount supplied
            // TODO how to handle rejections e.g already been purchased

            return contract.purchaseWithEther(_tokenId, {
              from: _buyer,
              value: assetToPurchase.priceInWei
            });
          })
          .then((res) => (res) => {
            console.log("Success", res);
          })
          .catch((e) => {
            // TODO re-enable UI on error
            // TODO Handle errors
            console.error("Failure", e);
          });

      } else {
        Vue.$log.error(`Unknown meta type ${assetToPurchase.type}`);
      }
    }
  }
});

export default store;
