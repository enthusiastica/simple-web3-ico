const { ethers } = require('hardhat');
const { artifacts } = require('hardhat');
const Web3 = require('web3');

// const contractAddress = "0xFB74ec978af1e2247dC4a21131Af2669f0423294";// Your ICO contract address

// const contract = new web3.eth.Contract(abi, contractAddress);


async function main() {
    const { API_URL, PRIVATE_KEY} = process.env;

    const ICOArtifact = artifacts.readArtifactSync('ICO');
    const ICOABI = ICOArtifact.abi;
    
    const web3 = new Web3(API_URL); // Replace with your own provider URL
    web3.eth.accounts.wallet.add(PRIVATE_KEY);
    const ICOAddress = '0x3494a452AF9B601b0742e9FC8931da2E9d61F9fd'; // Replace with the address of the XXXToken contract
    const ICOContract = new web3.eth.Contract(ICOABI, ICOAddress);

    const options = {
    from: "0x464595b93B6Ea445b53089D0b1DFc0a02bD40558",// Your Binance Smart Chain testnet address,
    value: 0,
    gas: 3000000
    };
    
    // Approve the spender to spend the specified amount of tokens
    await ICOContract.methods.withdraw().send(
        options,
        (error,transactionHash)=>{
        if (error) {
            console.error(error);
        } else {
            console.log("withdraw: ",transactionHash);
        }
    });
  }

  main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });