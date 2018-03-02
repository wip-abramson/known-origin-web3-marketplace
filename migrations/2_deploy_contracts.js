const _ = require('lodash');
const Eth = require('ethjs');

const KnownOriginDigitalAsset = artifacts.require("KnownOriginDigitalAsset");

const test_data = require('../config/test_data/sample.json');


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

    console.log(`Seeding test data = ${JSON.stringify(insert, null, 4)}`);

    let ipfs_data = {
      edition: insert.edition,
      description: insert.description,
      artist_name: insert.artist_name,
      low_res_img: insert.low_res_img,
    };
    console.log("TODO - upload to IPFS", ipfs_data);

    // TODO push up IPFS data

    // on success add ipfs_id
    insert.meta_data.ipfs_id = "123456789";

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
  }));
};

const flattenTestData = () => {
  let flat_inserts = [];

  _.forEach(test_data.artists, (artist) => {

    _.forEach(artist.artworks, (artwork) => {

      let artwork_name = artwork.artwork_name;
      let description = artwork.description;
      let edition = artwork.edition;

      let pieces = artwork.pieces;

      _.forEach(pieces, (piece) => {

        let type = piece.type;
        let number_of_editions = piece.number_of_editions;
        let low_res_img = artwork.low_res_img;

        let fiat_cost = piece.fiat_cost;
        let cost_in_eth = piece.cost_in_eth;
        let cost_in_wei = Eth.toWei(cost_in_eth, 'ether');

        let meta_data = {
          type: type,
          artist_name: artist.name,
        };

        let auction_start_date = 123; // TODO ability to convert start date to timestamp

        flat_inserts.push({
          type,
          number_of_editions,
          artwork_name,
          description,
          meta_data,
          low_res_img,
          edition,
          fiat_cost,
          cost_in_eth,
          cost_in_wei,
          auction_start_date
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
  "address": "0x5034f49b27353cedc562b49ea91c7438ea351d36",
  "transactionHash": "0xa671d8c31ad13008fb7e710e6ab20ce9ac44a5e83697a2f17c0495a58f5b1d08"
}
 */
