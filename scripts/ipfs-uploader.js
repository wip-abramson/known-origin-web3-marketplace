const IPFS = require('ipfs-api');
const fs = require('fs');

const ipfs = IPFS('ipfs.infura.io', '5001', {protocol: 'https'});

// Reset this cache file to { } to push fresh data to IPFS
const CACHE_FILE = './config/data/ipfs_data/cache.json';


//TODO update IPFS meta contract based on https://github.com/ethereum/eips/issues/721

/*

- meta upload should return full IPFS hash with corresponding subpaths in this format https://github.com/multiformats/multiaddr
- e.g. /ipfs/127.0.0.1/udp/1234
- example of specification https://ipfs.io/ipfs/QmZU8bKEG8fhcQwKoLHfjtJoKBzvUT5LFR3f8dEz86WdVeTransfer

/             -> (required) - root path  - full IPFS hash
/name         -> (required) - A name SHOULD be 50 characters or less, and unique amongst all NFTs tracked by this contract
/image        -> (optional) - it MUST contain a PNG, JPEG, or SVG image with at least 300 pixels of detail in each dimension
/description  -> (optional) - The description SHOULD be 1500 characters or less.
/other meta   -> (optional) - A contract MAY choose to include any number of additional subpaths

 */


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
