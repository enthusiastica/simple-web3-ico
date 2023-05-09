require("dotenv").config({ path: "./.env" });
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  defaultNetwork: "bsc",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    bsc: {
      url: API_URL || "https://bsc-dataseed.binance.org/",
      chainId: 97,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  solidity:"0.8.16"
}