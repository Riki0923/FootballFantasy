require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


module.exports = {
  solidity: "0.8.19",
  
  networks: {
    //Add extra chains as needed 
    hardhat: {
      chainId: 11155111,
    },
    arbitrumSepolia: {
      url: `${process.env.ALCHEMY_ARBITRUM_SEPOLIA_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY_METAMASK0}`,
        `0x${process.env.PRIVATE_KEY_METAMASK1}`
        ],
    }
  },
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: "RVQ9MVJYI13NNK3SYF1412K2JHHVX2CJ88"
  },
  // sourcify: {
  //   enabled: true
  // }
};