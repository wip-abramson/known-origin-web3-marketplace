const IPFS = require('ipfs-api');

const ipfs = IPFS();


const toStore = document.getElementById('source').value;
ipfs.add(Buffer.from(toStore), function (err, res) {
  if (err || !res) {
    return console.error('ipfs add error', err, res)
  }

  res.forEach(function (file) {
    if (file && file.hash) {
      console.log('successfully stored', file.hash);
      display(file.hash)
    }
  })
});

const uploadMetaData = ({img_location}) => {
  // TODO validate


};

module.exports = {
  uploadMetaData: uploadMetaData
};
