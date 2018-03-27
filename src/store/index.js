import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutation-types';
import _ from 'lodash';
import Web3 from 'web3';
import axios from 'axios';
import artistData from './artist-data';
import createLogger from 'vuex/dist/logger';
import { getNetIdString } from '../utils';

import { KnownOriginDigitalAsset } from '../contracts/index';

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
    contractAddress: '',

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
    assetsByArtistCode: [],

    // Frontend state
    purchaseState: {}
  },
  getters: {
    assetsForEdition: (state) => (edition) => {
      return state.assets.filter((asset) => asset.edition === edition);
    },
    availableAssetsForEdition: (state, getters) => (edition) => {
      let editions = getters.assetsForEdition(edition);
      return _.filter(editions, {purchased: 0});
    },
    firstAssetForEdition: (state) => (edition) => {
      return _.head(state.assets.filter((asset) => asset.edition === edition));
    },
    findNextAssetToPurchase: (state, getters) => (edition) => {
      let editions = getters.assetsForEdition(edition.edition);
      return _.chain(editions)
        .orderBy('editionNumber')
        .filter({purchased: 0})
        .head()
        .value();
    },
    assetById: (state) => (tokenId) => {
      return _.find(state.assets, (asset) => asset.id.toString() === tokenId.toString());
    },
    findArtist: (state) => (artistCode) => {
      return _.find(state.artists, (artist) => artist.artistCode.toString() === artistCode);
    },
    featuredArtists: (state) => {
      return state.artists.filter((a) => a.featured);
    },
    isCurator: (state) => {
      if (state.curatorAddress && state.account) {
        return state.curatorAddress.toLowerCase() === state.account.toLowerCase();
      }
      return false;
    },
    lookupAssetsByArtistCode: (state) => (artistCode) => {
      return _.filter(state.assetsByEditions, (key, value) => value.startsWith(artistCode));
    },
    assetPurchaseState: (state) => (assetId) => {
      return _.get(state.purchaseState, assetId);
    },
    isPurchaseTriggered: (state, getters) => (assetId) => {
      return _.get(getters.assetPurchaseState(assetId), 'state') === mutations.PURCHASE_TRIGGERED;
    },
    isPurchaseStarted: (state, getters) => (assetId) => {
      return _.get(getters.assetPurchaseState(assetId), 'state') === mutations.PURCHASE_STARTED;
    },
    isPurchaseSuccessful: (state, getters) => (assetId) => {
      return _.get(getters.assetPurchaseState(assetId), 'state') === mutations.PURCHASE_SUCCESSFUL;
    },
    isPurchaseFailed: (state, getters) => (assetId) => {
      return _.get(getters.assetPurchaseState(assetId), 'state') === mutations.PURCHASE_FAILED;
    }
  },
  mutations: {
    [mutations.SET_COMMISSION_ADDRESSES] (state, {curatorAddress, commissionAddress, contractDeveloperAddress, contractAddress}) {
      state.curatorAddress = curatorAddress;
      state.commissionAddress = commissionAddress;
      state.contractDeveloperAddress = contractDeveloperAddress;
      state.contractAddress = contractAddress;
    },
    [mutations.SET_ASSETS] (state, {assets, assetsByEditions, assetsByArtistCode}) {
      Vue.set(state, 'assets', assets);
      Vue.set(state, 'assetsByEditions', assetsByEditions);
      Vue.set(state, 'assetsByArtistCode', assetsByArtistCode);
    },
    [mutations.SET_ARTISTS] (state, {artists}) {
      state.artists = artists;
    },
    [mutations.SET_ASSETS_PURCHASED_FROM_ACCOUNT] (state, tokens) {
      Vue.set(state, 'assetsPurchasedByAccount', tokens);
    },
    [mutations.SET_TOTAL_PURCHASED] (state, {totalPurchaseValueInWei, totalNumberOfPurchases, totalPurchaseValueInEther}) {
      state.totalPurchaseValueInWei = totalPurchaseValueInWei;
      state.totalNumberOfPurchases = totalNumberOfPurchases;
      state.totalPurchaseValueInEther = totalPurchaseValueInEther;
    },
    [mutations.SET_CONTRACT_DETAILS] (state, {name, symbol, totalSupply}) {
      state.totalSupply = totalSupply;
      state.contractSymbol = symbol;
      state.contractName = name;
    },
    [mutations.SET_ACCOUNT] (state, {account, accountBalance}) {
      state.account = account;
      state.accountBalance = accountBalance;
      store.dispatch(actions.GET_ASSETS_PURCHASED_FOR_ACCOUNT);
    },
    [mutations.SET_CURRENT_NETWORK] (state, currentNetwork) {
      state.currentNetwork = currentNetwork;
    },
    [mutations.PURCHASE_TRIGGERED] (state, {tokenId, buyer}) {
      state.purchaseState = {
        ...state.purchaseState,
        [tokenId]: {tokenId, buyer, state: 'PURCHASE_TRIGGERED'}
      };
    },
    [mutations.PURCHASE_FAILED] (state, {tokenId, buyer}) {
      state.purchaseState = {
        ...state.purchaseState,
        [tokenId]: {tokenId, buyer, state: 'PURCHASE_FAILED'}
      };
    },
    [mutations.PURCHASE_SUCCESSFUL] (state, {tokenId, buyer}) {
      state.purchaseState = {
        ...state.purchaseState,
        [tokenId]: {tokenId, buyer, state: 'PURCHASE_SUCCESSFUL'}
      };
    },
    [mutations.PURCHASE_STARTED] (state, {tokenId, buyer}) {
      state.purchaseState = {
        ...state.purchaseState,
        [tokenId]: {tokenId, buyer, state: 'PURCHASE_STARTED'}
      };
    },
  },
  actions: {
    [actions.GET_ASSETS_PURCHASED_FOR_ACCOUNT] ({commit, dispatch, state}) {
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
    [actions.GET_CURRENT_NETWORK] ({commit, dispatch, state}) {
      getNetIdString()
        .then((currentNetwork) => {
          commit(mutations.SET_CURRENT_NETWORK, currentNetwork);
        });
    },
    [actions.INIT_APP] ({commit, dispatch, state}, account) {
      web3.eth.getAccounts()
        .then((accounts) => {
          // TODO add refresh cycle / timeout

          let account = accounts[0];

          // init the KODA contract
          dispatch(actions.REFRESH_CONTRACT_DETAILS);

          return web3.eth.getBalance(account)
            .then((balance) => {

              let accountBalance = Web3.utils.fromWei(balance);

              // store the account details
              commit(mutations.SET_ACCOUNT, {account, accountBalance});
            });
        })
        .catch(function (error) {
          console.log('ERROR - account locked', error);
          // TODO handle locked metamask account

        });
    },
    [actions.GET_ALL_ASSETS] ({commit, dispatch, state}) {

      const lookupIPFSData = (tokenUri) => {

        // Load root IPFS data
        return axios.get(`${tokenUri}`)
          .then((tokenMeta) => {

            let rootMeta = tokenMeta.data;

            // Load additional meta about asset from IPFS
            return axios.get(`${rootMeta.meta}`)
              .then((otherMeta) => {
                return {
                  name: rootMeta.name,
                  description: rootMeta.description,
                  otherMeta: otherMeta.data,
                  lowResImg: rootMeta.image
                };
              });
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

            let tokenUri = editionInfo[6];

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
              artistCode: editionInfo[2].toString().substring(0, 3),
              tokenUri: tokenUri
            };

            return lookupIPFSData(tokenUri).then((ipfsMeata) => {
              // set IPFS lookup back on object
              _.set(fullAssetDetails, 'otherMeta', ipfsMeata.otherMeta);
              _.set(fullAssetDetails, 'description', ipfsMeata.description);
              _.set(fullAssetDetails, 'lowResImg', ipfsMeata.lowResImg);
              return fullAssetDetails;
            });
          });
      };

      KnownOriginDigitalAsset.deployed()
        .then((contract) => {
          let supply = _.range(0, state.totalSupply);

          return Promise.all(_.map(supply, (index) => lookupAssetInfo(contract, index)))
            .then((assets) => {

              let assetsByEditions = _.groupBy(assets, 'edition');
              let assetsByArtistCode = _.groupBy(assets, 'artistCode');

              commit(mutations.SET_ASSETS, {
                assets: assets,
                assetsByEditions: assetsByEditions,
                assetsByArtistCode: assetsByArtistCode,
              });
            });
        });
    },
    [actions.REFRESH_CONTRACT_DETAILS] ({commit, dispatch, state}) {
      KnownOriginDigitalAsset.deployed()
        .then((contract) => {

          Promise.all([contract.curator(), contract.commissionAccount(), contract.contractDeveloper(), contract.address])
            .then((results) => {
              commit(mutations.SET_COMMISSION_ADDRESSES, {
                curatorAddress: results[0],
                commissionAddress: results[1],
                contractDeveloperAddress: results[2],
                contractAddress: results[3]
              });
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

      KnownOriginDigitalAsset.deployed()
        .then((contract) => {

          let _buyer = state.account;
          let _tokenId = assetToPurchase.id;

          let purchaseEvent = contract.PurchasedWithEther({_tokenId: _tokenId, _buyer: _buyer}, {
            fromBlock: web3.eth.blockNumber,
            toBlock: 'latest' // wait until event comes through
          });

          purchaseEvent.watch(function (error, result) {
            if (!error) {
              // 3) Purchase succeeded
              dispatch(actions.REFRESH_CONTRACT_DETAILS);
              dispatch(actions.GET_ASSETS_PURCHASED_FOR_ACCOUNT);
              commit(mutations.PURCHASE_SUCCESSFUL, {tokenId: _tokenId, buyer: _buyer});
            } else {
              // Purchase failure
              commit(mutations.PURCHASE_FAILED, {tokenId: _tokenId, buyer: _buyer});
              purchaseEvent.stopWatching();
              console.log('Failure', error);
            }
          });

          // 1) Initial purchase flow
          commit(mutations.PURCHASE_TRIGGERED, {tokenId: _tokenId, buyer: _buyer});

          let purchase = contract.purchaseWithEther(_tokenId, {
            from: _buyer,
            value: assetToPurchase.priceInWei
          });

          purchase
            .then((data) => {
              // 2) Purchase transaction submitted
              console.log('Purchase transaction submitted', data);
              commit(mutations.PURCHASE_STARTED, {tokenId: _tokenId, buyer: _buyer});
            })
            .catch((error) => {
              // Purchase failure
              console.log('Purchase rejection/error', error);
              commit(mutations.PURCHASE_FAILED, {tokenId: _tokenId, buyer: _buyer});
            });
        })
        .catch((e) => {
          console.log('Failure', e);
          commit(mutations.PURCHASE_FAILED, {tokenId: assetToPurchase.id, buyer: state.account});
        });
    },
    [actions.PURCHASE_ASSET_WITH_FIAT] ({commit, dispatch, state} = controls, assetToPurchase) {

      let _buyer = state.account;
      let _tokenId = assetToPurchase.id;

      return KnownOriginDigitalAsset.deployed()
        .then((contract) => {

          let purchaseEvent = contract.PurchasedWithFiat({_tokenId: _tokenId}, {
            fromBlock: web3.eth.blockNumber,
            toBlock: 'latest' // wait until event comes through
          });

          purchaseEvent.watch(function (error, result) {
            if (!error) {
              // 3) Purchase succeeded
              dispatch(actions.REFRESH_CONTRACT_DETAILS);
              dispatch(actions.GET_ASSETS_PURCHASED_FOR_ACCOUNT);
              commit(mutations.PURCHASE_SUCCESSFUL, {tokenId: _tokenId, buyer: _buyer});
            } else {
              // Purchase failure
              commit(mutations.PURCHASE_FAILED, {tokenId: _tokenId, buyer: _buyer});
              purchaseEvent.stopWatching();
              console.log('Failure', error);
            }
          });

          // 1) Initial purchase flow
          commit(mutations.PURCHASE_TRIGGERED, {tokenId: _tokenId, buyer: _buyer});

          let purchase = contract.purchaseWithFiat(_tokenId, {from: _buyer});

          purchase
            .then((data) => {
              // 2) Purchase transaction submitted
              console.log('Purchase transaction submitted', data);
              commit(mutations.PURCHASE_STARTED, {tokenId: _tokenId, buyer: _buyer});
            })
            .catch((error) => {
              // Purchase failure
              console.log('Purchase rejection/error', error);
              commit(mutations.PURCHASE_FAILED, {tokenId: _tokenId, buyer: _buyer});
            });
        })
        .catch((e) => {
          console.log('Failure', e);
          commit(mutations.PURCHASE_FAILED, {tokenId: assetToPurchase.id, buyer: state.account});
        });
    },
    [actions.REVERSE_PURCHASE_ASSET_WITH_FIAT] ({commit, dispatch, state}, assetToPurchase) {

      let _buyer = state.account;
      let _tokenId = assetToPurchase.id;

      return KnownOriginDigitalAsset.deployed()
        .then((contract) => {

          let purchaseEvent = contract.PurchasedWithFiatReversed({_tokenId: _tokenId}, {
            fromBlock: web3.eth.blockNumber,
            toBlock: 'latest' // wait until event comes through
          });

          purchaseEvent.watch(function (error, result) {
            if (!error) {
              // 3) Purchase succeeded
              dispatch(actions.REFRESH_CONTRACT_DETAILS);
              dispatch(actions.GET_ASSETS_PURCHASED_FOR_ACCOUNT);
              commit(mutations.PURCHASE_SUCCESSFUL, {tokenId: _tokenId, buyer: _buyer});
            } else {
              // Purchase failure
              commit(mutations.PURCHASE_FAILED, {tokenId: _tokenId, buyer: _buyer});
              purchaseEvent.stopWatching();
              console.log('Failure', error);
            }
          });

          // 1) Initial purchase flow
          commit(mutations.PURCHASE_TRIGGERED, {tokenId: _tokenId, buyer: _buyer});

          let purchase = contract.reverseFiatPurchase(_tokenId, {from: _buyer});

          purchase
            .then((data) => {
              // 2) Purchase transaction submitted
              console.log('Purchase transaction submitted', data);
              commit(mutations.PURCHASE_STARTED, {tokenId: _tokenId, buyer: _buyer});
            })
            .catch((error) => {
              // Purchase failure
              console.log('Purchase rejection/error', error);
              commit(mutations.PURCHASE_FAILED, {tokenId: _tokenId, buyer: _buyer});
            });
        })
        .catch((e) => {
          console.log('Failure', e);
          commit(mutations.PURCHASE_FAILED, {tokenId: assetToPurchase.id, buyer: state.account});
        });
    }
  }
});

export default store;
