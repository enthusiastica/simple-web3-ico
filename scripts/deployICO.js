const hre = require("hardhat");


const tokenAddress = "0x8312Bd7F944B5aebeE20CFd2E2c76562938792db"; // Replace with your token contract address
const startTime = Math.floor(Date.now()/1000) - 3600 * 16 + 2 * 60; // Replace with your start time in Unix timestamp format
const endTime = Math.floor(Date.now()/1000) - 3600 * 16 + 3600; // Replace with your end time in Unix timestamp format

async function deploy() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying ICO contract...");
  const ICO = await ethers.getContractFactory("ICO");
  const ico = await ICO.deploy(tokenAddress, startTime, endTime);
  await ico.deployed();

  console.log("ICO contract deployed to:", ico.address);
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });