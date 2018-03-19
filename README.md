# Known Origin Digital Market P;lace


## Installation

1. Install [Truffle](http://truffleframework.com) and an Ethereum client - like [EthereumJS TestRPC](https://github.com/ethereumjs/testrpc).
	```
	npm install -g truffle
	npm install -g ethereumjs-testrpc
	```

2. Compile and migrate the contracts.
	```
	truffle compile
	truffle migrate
	```
	* use `npm run clean` to clean the build directory
	* `truffle compile --all` to force compile all
	* `truffle migrate --reset --all` to force  migrate all 

3. Run the webpack server for front-end hot reloading. Smart contract changes do not support hot reloading for now.
	```
	npm run start
	```
    
## Tests
This box comes with everything bundled for `unit`, `e2e` and `truffle` contracts testing.

1. `unit` and `e2e` tests.
	```
	npm run test/dapp
	```

2. `truffle` contracts tests.
	```
	npm run test/truffle
	```

3. Alternatively you can directly run `unit`, `e2e` and `truffle` contracts tests in one command.
	```
	npm run test
	```

## Build for production
To build the application for production, use the build command. A production build will be compiled in the `dist` folder.
```javascript
npm run build
```

#### History

* Original project based on https://github.com/wespr/truffle-vue
* Base contracts based on https://github.com/OpenZeppelin/zeppelin-solidity
