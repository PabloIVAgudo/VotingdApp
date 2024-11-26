import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    alchemy: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
