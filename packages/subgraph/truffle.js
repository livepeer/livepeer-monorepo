module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 6600000,
    },
    docker: {
      host: "ganache",
      port: 8545,
      network_id: "*",
      gas: 6600000,
    },
  },
  mocha: {
    enableTimeouts: false,
    before_timeout: 120000,
  },
};
