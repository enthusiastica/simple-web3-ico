// const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const XXXToken = await ethers.getContractFactory("XXXToken");
  const xxxToken = await XXXToken.deploy();

  console.log("XXXToken deployed to:", xxxToken.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });