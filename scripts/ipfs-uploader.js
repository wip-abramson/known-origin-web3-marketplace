const IPFS = require('ipfs-api');
const fs = require('fs');

const ipfs = IPFS('ipfs.infura.io', '5001', {protocol: 'https'});

// Reset this cache file to { } to push fresh data to IPFS
const CACHE_FILE = './config/data/ipfs_data/cache.json';

const uploadMetaData = ({ipfsPath}) => {
  console.log(`Attempting to upload files in [${ipfsPath}]`);

  // Check cache as to not upload duplicates
  let cachedIpfsHash = getCachedIpfsHashes(ipfsPath);
  if (cachedIpfsHash) {
    console.log(`Found cached version of [${ipfsPath}] - ipfs hash ${cachedIpfsHash}`);
    return Promise.resolve({hash: cachedIpfsHash})
  }

  return ipfs.add([
      {
        path: `${ipfsPath}/low_res.jpeg`,
        content: fs.createReadStream(`./config/data/ipfs_data/${ipfsPath}/low_res.jpeg`)
      },
      {
        path: `${ipfsPath}/meta.json`,
        content: fs.createReadStream(`./config/data/ipfs_data/${ipfsPath}/meta.json`)
      }
    ], {recursive: false}
  )
    .then((res) => {
      console.log('Uploaded file to IPFS', res);
      let rootHash = _.last(res);

      cacheIpfsHashes(ipfsPath, rootHash);

      // web url= http://localhost:5001/ipfs/QmPhnvn747LqwPYMJmQVorMaGbMSgA7mRRoyyZYz3DoZRQ/#/
      // http lookup url = http://127.0.0.1:8080/ipfs/QmYQHraKUAhpbqoTUEzojoZjtuufmfdXpta1wPTM2A7QFm

      return rootHash;
    });
};

const cacheIpfsHashes = (ipfsPath, rootHash) => {
  let cache = JSON.parse(fs.readFileSync(CACHE_FILE));
  let updatedCache = _.set(cache, ipfsPath, rootHash.hash);
  console.log(updatedCache);
  fs.writeFileSync(CACHE_FILE, JSON.stringify(updatedCache, null, 4));
};

const getCachedIpfsHashes = (ipfsPath) => {
  let cache = JSON.parse(fs.readFileSync(CACHE_FILE));
  return _.get(cache, ipfsPath);
};

module.exports = {
  uploadMetaData: uploadMetaData
};
