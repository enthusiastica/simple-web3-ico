const { ethers } = require('hardhat');
const { artifacts } = require('hardhat');
const Web3 = require('web3');

// const contractAddress = "0xFB74ec978af1e2247dC4a21131Af2669f0423294";// Your XXX contract address

// const contract = new web3.eth.Contract(abi, contractAddress);


async function main() {
    const { API_URL, PRIVATE_KEY} = process.env;

    const XXXArtifact = artifacts.readArtifactSync('XXXToken');
    const XXXABI = XXXArtifact.abi;
    
    const web3 = new Web3(API_URL); // Replace with your own provider URL
    web3.eth.accounts.wallet.add(PRIVATE_KEY);
    const XXXAddress = '0x8312Bd7F944B5aebeE20CFd2E2c76562938792db'; // Replace with the address of the XXXToken contract
    const XXXContract = new web3.eth.Contract(XXXABI, XXXAddress);

    const ofwho = "0xA7E8c6AEB301A21d4d7A2c74718176663fB83e83";
    // Approve the spender to spend the specified amount of tokens
    const balance = await XXXContract.methods.balanceOf(ofwho).call();
    const BNBbalance = balance/10**18;
    console.log(`Balance of XXXToken for ${ofwho}: ${BNBbalance}`);
  }

  main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });