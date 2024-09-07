const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const subId ="15347646639104758771706514788856220792160553849577192965243249900884002281132"
  
  //Football contract

  const FantasyFootball = await ethers.getContractFactory("FootballFantasy");
  const fantasyFootball = await FantasyFootball.deploy(subId); // No subscription ID needed
  console.log("FantasyFootball deployed to:", fantasyFootball.target);

  // test VRF contract:
  // const testVRF = await ethers.getContractFactory("SubscriptionConsumer");
  // const testvrf = await testVRF.deploy(subId)

  // console.log("testVRF deployed at: ", testvrf.target)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
