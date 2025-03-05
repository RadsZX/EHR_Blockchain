require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const privateKeys = process.env.PRIVATE_KEYS || "701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82";
const goerliApiKey = process.env.GOERLI_API_KEY || "https://goerli.infura.io/v3/4218be44ec5b409a825eeda2fa45b923";
const mumbaiApiKey = process.env.MUMBAI_API_KEY || "https://polygon-mainnet.infura.io/v3/4218be44ec5b409a825eeda2fa45b923";
module.exports = {
  solidity: "0.8.18",
  networks: {
    localhost: {},
    goerli: {
      url: goerliApiKey,
      accounts: privateKeys.split(","),
    },
    mumbai: {
      url: mumbaiApiKey,
      accounts: privateKeys.split(","),
    },
  },
};
