/* global web3:true */

import contract from 'truffle-contract';

// import artifacts
import knownOriginDigitalAsset from '../../build/contracts/KnownOriginDigitalAsset.json';

// create contracts
const KnownOriginDigitalAsset = contract(knownOriginDigitalAsset);

if (typeof web3 !== 'undefined') {
  KnownOriginDigitalAsset.setProvider(web3.currentProvider);
}

export {
  KnownOriginDigitalAsset
};
