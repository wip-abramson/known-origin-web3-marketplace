const IPFS = require('ipfs-api');
const fs = require('fs');

const ipfs = IPFS('ipfs.infura.io', '5001', {protocol: 'https'});

const uploadMetaData = ({ipfs_path}) => {
  console.log(`Attempting to upload files in [${ipfs_path}]`);

  // Check cache as to not upload duplicates
  let cache = JSON.parse(fs.readFileSync('./config/data/ipfs_data/cache.json'));
  let cachedIpfsHash = _.get(cache, ipfs_path);
  if (cachedIpfsHash) {
    console.log(`Found cached version of [${ipfs_path}] - ipfs hash ${cachedIpfsHash}`);
    return Promise.resolve({hash: cachedIpfsHash})
  }

  return ipfs.add(
    [
      {
        path: `${ipfs_path}/low_res.jpeg`,
        content: fs.createReadStream(`./config/data/ipfs_data/${ipfs_path}/low_res.jpeg`)
      },
      {
        path: `${ipfs_path}/meta.json`,
        content: fs.createReadStream(`./config/data/ipfs_data/${ipfs_path}/meta.json`)
      }
    ],
    {recursive: false}
  )
    .then((res) => {
      console.log('Uploaded file to IPFS', res);
      let rootHash = _.last(res);

      // Update cache so we dont have to do it everytime
      let cache = JSON.parse(fs.readFileSync('./config/data/ipfs_data/cache.json'));
      let updatedCache = _.set(cache, ipfs_path, rootHash.hash);
      console.log(updatedCache);
      fs.writeFileSync('./config/data/ipfs_data/cache.json', JSON.stringify(updatedCache, null, 4));

      // web url= http://localhost:5001/ipfs/QmPhnvn747LqwPYMJmQVorMaGbMSgA7mRRoyyZYz3DoZRQ/#/
      // http lookup url = http://127.0.0.1:8080/ipfs/QmYQHraKUAhpbqoTUEzojoZjtuufmfdXpta1wPTM2A7QFm

      return rootHash;
    });
};

module.exports = {
  uploadMetaData: uploadMetaData
};

// uploadMetaData(({ipfs_path: 'blockrocket'}));
