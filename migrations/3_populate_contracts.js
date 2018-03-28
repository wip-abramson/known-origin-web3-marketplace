const Promise = require('bluebird');
const _ = require('lodash');
const Eth = require('ethjs');

const KnownOriginDigitalAsset = artifacts.require('KnownOriginDigitalAsset');

const ipfsUploader = require('../scripts/ipfs-uploader');

const galleryData = require('../config/data/gallery.json');

let promisifyGetBlockNumber = Promise.promisify(web3.eth.getBlockNumber);
let promisifyGetBlock = Promise.promisify(web3.eth.getBlock);

module.exports = function (deployer, network, accounts) {

  let _curatorAccount = accounts[0];

  deployer
    .then(() => KnownOriginDigitalAsset.deployed())
    .then((instance) => promisifyGetBlockNumber()
      .then((blockNumber) => {
        return promisifyGetBlock(blockNumber)
          .then((block) => {
            return {
              block, instance
            };
          });
      }))
    .then(({instance, block}) => {

      console.log(`Deployed contract to address = [${instance.address}] to network [${network}]`);

      if (network === 'ganache' || network === 'ropsten' || network === 'rinkeby') {
        console.log(`Loading in seed data`);

        const _openingTime = block.timestamp + 1; // one second in the future

        return loadSeedData(instance, _curatorAccount, _openingTime);
      } else {
        console.log(`SKIPPING loading seed data as running on ${network}`);
      }

      return instance;
    });

};

const loadSeedData = (instance, _curatorAccount, _openingTime) => {

  let flatInserts = flattenTestData();

  return Promise.all(_.map(flatInserts, (insert) => {
    console.log(`Seeding test data for [${insert.artworkName}]`);

    return ipfsUploader.uploadMetaData(insert)
      .then((tokenUri) => {

        // mint edition
        return instance.mintEdition(
          tokenUri,
          insert.edition,
          insert.artistName,
          insert.artworkName,
          insert.numberOfEditions,
          insert.costInWei.toString(10),
          _openingTime,
          {
            from: _curatorAccount,
          }
        );
      });
  }));
};

const flattenTestData = () => {
  let flatInserts = [];

  _.forEach(galleryData.artists, (artist) => {

    let artistName = artist.name;

    _.forEach(artist.artworks, (artwork) => {

      let artworkName = artwork.artworkName;
      let ipfsPath = artwork.ipfsPath;

      let numberOfEditions = artwork.numberOfEditions;
      let edition = artwork.edition;
      if (edition.length !== 16) {
        throw new Error(`Edition ${edition} not 16 chars long`);
      }

      let fiatCost = artwork.fiatCost;
      let costInWei = Eth.toWei(artwork.costInEth, 'ether');

      flatInserts.push({
        numberOfEditions,
        artworkName,
        fiatCost,
        costInWei,
        ipfsPath,
        edition,
        artistName
      });

    });
  });

  return flatInserts;
};

/*
 "5777": {
 "events": {},
 "links": {},
 "address": "0x345ca3e014aaf5dca488057592ee47305d9b3e10",
 "transactionHash": "0x5494484f9242d926c550fa95e4b03ee3e961fb5350b44f329aad7f1274fe561c"
 }
 */
