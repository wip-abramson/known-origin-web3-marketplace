import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions'
import * as mutations from './mutation-types'
import _ from 'lodash'
import Web3 from 'web3'
import axios from 'axios'
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
    artists: [
      {
        name: 'Barrie J Davis',
        twitter: '@barriejdavies',
        bio: 'Hello, I\'m Barrie J Davies and I\'m an artist (born 1977) I\'m a British artist from Milford Haven, Pembrokeshire, Wales. I graduated from the Southampton Institute with a Fine Art degree in 2000 and I completed my Master\'s Degree at the University of Wales Institute, Cardiff in 2004. I now live and work in Brighton, England UK. My artwork is a fun colourful psychedelic and humourous approach to expose the human condition: notions of success, money, glamour, love, death, sex, gender & religion are picked at with dry comedic use of tragedy meshed with absurdity.',
        img: 'https://static1.squarespace.com/static/5a8b2af5692ebefdc3fc957a/t/5a948d3a652dea86531e1b20/1519684938013/BarrieJD.png'
      },
      {
        name: 'James O’connell',
        twitter: '@Jamesp0p',
        bio: 'James Oconnell is a Manchester based creative who has a passion for mixing colour and lines. He applies his minimalistic style to a variety of themes and has created work for the likes of Wired Magazine, Youtube, T3 Magazine, BBC and The Atlantic to name a few. He is hugely inspired by contemporary pop culture in all its forms - from motion pictures, music to advertising and sport. Simplicity is the key to his work allowing the expression of the idea to reign supreme..',
        img: 'https://static1.squarespace.com/static/5a8b2af5692ebefdc3fc957a/t/5a948a6de4966b8b93cd2a3b/1519684215997/JaneB.png'
      },
      {
        name: 'Matt Ferres',
        twitter: '@saveferres',
        bio: '...TODO...',
        img: 'https://static1.squarespace.com/static/5a8b2af5692ebefdc3fc957a/t/5a94896c0d929738ef116393/1519683968371/JamesO_profile.png'
      },
      {
        name: 'Peter Davis',
        twitter: '@peterdavis_art',
        bio: 'I am a prize-winning professional portrait painter and elected member of the Manchester Academy of Fine Arts (MAFA). My aim, as a social realist painter, is to capture the spirit of the age and create contemporary portraiture that tells stories about my sitters through a strong visual narrative.',
        img: 'https://static1.squarespace.com/static/5a8b2af5692ebefdc3fc957a/t/5a94896c0d929738ef116393/1519683968371/JamesO_profile.png'
      },
      {
        name: 'Sam Taylor',
        twitter: '@SptSam',
        bio: 'I am a prize-winning professional portrait painter and elected member of the Manchester Academy of Fine Arts (MAFA). My aim, as a social realist painter, is to capture the spirit of the age and create contemporary portraiture that tells stories about my sitters through a strong visual narrative.',
        img: 'https://static1.squarespace.com/static/5a8b2af5692ebefdc3fc957a/t/5a94896c0d929738ef116393/1519683968371/JamesO_profile.png'
      },
      {
        name: 'Jane Bowyer',
        twitter: '@bowyerjane',
        bio: 'Jane Bowyer is an independent graphic designer and illustrator based in Manchester.',
        img: 'https://static1.squarespace.com/static/5a8b2af5692ebefdc3fc957a/t/5a94896c0d929738ef116393/1519683968371/JamesO_profile.png'
      }
    ],
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

      const lookupIpfsMeta = (hash) => {
        return axios.get(`https://ipfs.infura.io/ipfs/${hash}/meta.json`)
          .then((result) => result.data);
      };

      KnownOriginDigitalAsset.deployed()
        .then((contract) => {
          let supply = _.range(0, state.totalSupply);

          return Promise.all(_.map(supply, (index) => contract.assetInfo(index)))
            .then((results) => {

              let flatMappedAssets = _.map(results, (result) => {

                let meta = utils.safeFromJson(result[2]);

                let lowResImg = `https://ipfs.infura.io/ipfs/${meta.ipfsHash}/low_res.jpeg`;

                const decorateIpfsData = (ipfsMetaData) => {
                  return {
                    id: result[0].toNumber(),
                    owner: result[1].toString(),
                    meta: meta,
                    lowResImg: lowResImg,
                    ipfsMeta: ipfsMetaData,
                    edition: result[3].toString(),
                    editionNumber: result[4].toNumber(),
                    purchased: result[5].toNumber(),
                    priceInWei: result[6].toString(),
                    priceInEther: Web3.utils.fromWei(result[6].toString(), 'ether').valueOf()
                  }
                };

                return lookupIpfsMeta(meta.ipfsHash).then(decorateIpfsData);
              });

              Promise.all(flatMappedAssets)
                .then((assets) => {

                  let assetsByEditions = _.groupBy(assets, 'edition');
                  let assetsByArtists = _.groupBy(assets, 'meta.artistName');

                  commit(mutations.SET_ASSETS, {
                    assets: assets,
                    assetsByEditions: assetsByEditions,
                    assetsByArtists: assetsByArtists,
                  })
                });
            })
        })
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
    [actions.PURCHASE_ASSET]({commit, dispatch, state}, assetToPurchase) {
      console.log('assetToPurchase', assetToPurchase);
      Vue.$log.debug(`Attempting purchase of ${assetToPurchase.meta.type} asset - ID ${assetToPurchase.id}`);

      // TODO do we need to double check asset still available before submitting a transaction?
      // TODO do we need to validate account balances and account set?
      // TODO Handle errors
      // TODO send event to disable UI when in play
      // TODO send event to re-enable UI once complete

      if (assetToPurchase.meta.type === 'physical') {

        // TODO handle physical purchases

      } else if (assetToPurchase.meta.type === 'digital') {

        KnownOriginDigitalAsset.deployed()
          .then((contract) => {

            let _buyer = state.account;
            let _tokenId = assetToPurchase.id;

            let individualPurchaseEvent = contract.PurchasedWithEther({_tokenId: _tokenId, _buyer: _buyer}, {
              fromBlock: 0,
              toBlock: 'latest'
            });

            individualPurchaseEvent.watch(function (error, result) {
              if (!error) {
                dispatch(actions.REFRESH_CONTRACT_DETAILS);
                dispatch(actions.GET_ASSETS_PURCHASED_FOR_ACCOUNT);
                individualPurchaseEvent.stopWatching();
              }
            });

            return contract.purchaseWithEther(_tokenId, {
              from: _buyer,
              value: assetToPurchase.priceInWei
            });
          })
          .then((res) => (res) => {
            Vue.$log.debug("SUCCESS", res);
          })
          .catch((e) => Vue.$log.error)

      } else {
        Vue.$log.error(`Unknown meta type ${assetToPurchase.meta.type}`);
      }
    }
  }
});

export default store;
