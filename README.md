# Known Origin Digital Market P;lace


## Installation

1. Install [Ganache](http://truffleframework.com/ganache/).

2. Install [Truffle](http://truffleframework.com).
	```
	npm install -g truffle
	```

3. Install [Metamask](https://metamask.io/) in chrome so you can test purchasing assets

4. When running locally you will need to link your *Metamask* account and your locally running Ganache.
  * In Metamask - ensure you are logged out.
  * In Metamask - `Restore from seed phrase` and place the 12 word seed from the Ganache in to Metamask
     * This will link the accounts inside Ganache with Metamask & give you 100 ETH to test with
  * In Metamask - add a custom network of `http://127.0.0.1:7545` - this is Ganache
     * This will point Metamask at your locally running Ganache blockchain
     
5. Compile and migrate the contracts to your local blockchain (default is *ganache*).
	```
	./clean_deploy_local.sh
	```
	* This will compile the contracts and place the ABI files into `/build/` as well as deploying to Ganache 

6. Run the webpack server for front-end hot reloading. Smart contract changes do not support hot reloading for now.
	```
	npm run start
	```
  **It should now work!** 
 
## Build for production
To build the application for production, use the build command. A production build will be compiled in the `dist` folder.
```javascript
npm run build
```

#### History

* Original project based on https://github.com/wespr/truffle-vue
* Base contracts based on https://github.com/OpenZeppelin/zeppelin-solidity
