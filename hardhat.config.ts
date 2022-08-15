import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 1337,
    },
    mumbai: {
      url: process.env.MUMBAI_API_URL,
      accounts: [process.env.MUMBAI_ACCOUNT_KEY!],
    },
  },
};

export default config;
