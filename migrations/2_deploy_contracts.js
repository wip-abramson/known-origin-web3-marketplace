const _ = require('lodash');
const Eth = require('ethjs');

const KnownOriginDigitalAsset = artifacts.require("KnownOriginDigitalAsset");

const ipfsUploader = require('./ipfs_uploader');

const gallery_data = require('../config/data/gallery.json');


module.exports = function (deployer, network, accounts) {

  let _curatorAccount = accounts[0];
  let _commissionAccount = accounts[1];
  let _contractDeveloper = accounts[2];

  deployer
    .then(() => {
      return KnownOriginDigitalAsset.new(_commissionAccount, _contractDeveloper, {from: _curatorAccount});
    })
    .then((instance) => {

      console.log(`Deployed contract to address = [${instance.address}] to network [${network}]`);

      if (network === 'development') {
        return loadSeedData(instance, _curatorAccount)
          .then(() => instance);
      }
      return instance;
    });

};

const loadSeedData = (instance, _curatorAccount) => {

  let flat_inserts = flattenTestData();

  return Promise.all(_.map(flat_inserts, (insert) => {
    console.log(`Seeding test data for [${insert.artwork_name}]`);

    return ipfsUploader.uploadMetaData(insert)
      .then((res) => {

        // on success add ipfs_id
        insert.meta_data.ipfs_id = res.hash;

        let meta_data = JSON.stringify(insert.meta_data);

        // mint edition
        return instance.mintEdition(
          meta_data,
          insert.artwork_name,
          insert.number_of_editions,
          insert.cost_in_wei.toString(10),
          insert.auction_start_date,
          {
            from: _curatorAccount,
          }
        )
      })
  }));
};

const flattenTestData = () => {
  let flat_inserts = [];

  _.forEach(gallery_data.artists, (artist) => {

    _.forEach(artist.artworks, (artwork) => {

      let artwork_name = artwork.artwork_name;
      let pieces = artwork.pieces;
      let ipfs_path = artwork.ipfs_path;

      _.forEach(pieces, (piece) => {

        let type = piece.type;
        let number_of_editions = piece.number_of_editions;

        let fiat_cost = piece.fiat_cost;
        let cost_in_wei = Eth.toWei(piece.cost_in_eth, 'ether');

        let meta_data = {
          type: type,
          artist_name: artist.name
        };

        let auction_start_date = 123; // TODO ability to convert start date to timestamp

        flat_inserts.push({
          number_of_editions,
          artwork_name,
          fiat_cost,
          cost_in_wei,
          auction_start_date,
          meta_data,
          ipfs_path
        })
      });
    });
  });

  return flat_inserts;
};

/*
"5777": {
  "events": {},
  "links": {},
  "address": "0x345ca3e014aaf5dca488057592ee47305d9b3e10",
  "transactionHash": "0x5494484f9242d926c550fa95e4b03ee3e961fb5350b44f329aad7f1274fe561c"
}
 */
