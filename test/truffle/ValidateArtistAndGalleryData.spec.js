const fs = require('fs');
const _ = require('lodash');

require('chai')
  .use(require('chai-as-promised'))
  .should();

describe('testing gallery and metatdata', function () {

  beforeEach(function (done) {
    this.artistsData = require('../../src/store/artist-data.js');
    this.galleryData = JSON.parse(fs.readFileSync('./config/data/gallery.json'));

    this.artistCodes = _.map(this.artistsData, function (data) {
      return data.artistCode;
    });

    done();
  });

  it('all artists should have unique values', function () {
    let uniqueArtistsCode = _.uniq(this.artistCodes);
    uniqueArtistsCode.should.be.deep.equals(this.artistCodes);
  });

  it('all gallery items should match edition code to artists', function () {
    _.forEach(this.galleryData.artists, (item) => {
      _.forEach(item.artworks, (artwork) => {
        let artistCode = artwork.edition.substring(0, 3);
        assert.isTrue(this.artistCodes.indexOf(artistCode) !== -1, `unable to find ${artistCode} in list of artists`);
      });
    });
  });

  it('all gallery items should match edition code to dig/phy', function () {
    _.forEach(this.galleryData.artists, (item) => {
      _.forEach(item.artworks, (artwork) => {
        let typeCode = artwork.edition.substring(13, 16);
        assert.isTrue(['DIG', 'PHY'].indexOf(typeCode) !== -1, `unable to find ${typeCode} in ['DIG', 'PHY']`);
      });
    });
  });

  it('all gallery items have the correct ipfsPath', function () {
    _.forEach(this.galleryData.artists, (item) => {
      _.forEach(item.artworks, (artwork) => {
        let ipfsPath = artwork.ipfsPath;

        const existsSync = fs.existsSync(`./config/data/ipfs_data/${ipfsPath}/low_res.jpeg`) || fs.existsSync(`./config/data/ipfs_data/${ipfsPath}/low_res.gif`);

        assert.isTrue(existsSync, `/${ipfsPath}/low_res.(jpeg|gif) NOT FOUND`);

        assert.isTrue(fs.existsSync(`./config/data/ipfs_data/${ipfsPath}/meta.json`), `/${ipfsPath}/meta.json NOT FOUND`);

        let metaData = JSON.parse(fs.readFileSync(`./config/data/ipfs_data/${ipfsPath}/meta.json`));

        assert.isDefined(metaData.artist, `metadata artist not found for ${ipfsPath}`);
        assert.isDefined(metaData.artworkName, `metadata artworkName not found for ${ipfsPath}`);
        assert.isDefined(metaData.description, `metadata description not found for ${ipfsPath}`);

      });
    });
  });
});
