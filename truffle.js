module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      // port: 8545, // - testrpc
      port: 7545, // - ganache
      network_id: "*" // Match any network id
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    }
  }
  // 92.19 -> 91.03 = 1.16 (before optimizer)
  // 89.86 -> 88.83 = 1.03 (after optimizer)
};
