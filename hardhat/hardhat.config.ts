import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    emerald_local: {
      url: "http://localhost:8545",
      accounts:
        [
          '0xd4139ae73b7c00b68663918cfdf118ba672320539535d66638df3861b467b15f',
          '0xdbd5c8248d2324e20564604fb90497868cb499c4ad346e2a918934e8b9024b46',
          '0x567cb7d8cb56c6216a5b03c0265a81d7624146afbf9561d6b1dbaeaa4eb67bfd',
          '0xaa6f624ced1e9bae392d44362f3dcae59df5aedb32319367455e0ba43222f7fe',
          '0x61e4888547683ef0c33feb717ae81fc52d9ce3d78e23e028c3a4399ad48e3f80',
        ]
        //process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  defaultNetwork: "emerald_local",
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    artifacts: "./../src/artifacts",
  },
  typechain: {
    outDir: "./../src/typechain",
  },
  contractSizer: {
    runOnCompile: true,
    strict: true,
    only: [
      'QuizManager'
    ]
  }
};

export default config;
