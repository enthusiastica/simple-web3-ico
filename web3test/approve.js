const { artifacts } = require('hardhat');

async function main() {
    const { API_URL, PRIVATE_KEY} = process.env;

    const XXXArtifact = artifacts.readArtifactSync('XXXToken');
    const XXXTokenABI = XXXArtifact.abi;
    const Web3 = require('web3');
    // const XXXTokenABI = require('./../XXXTokenABI.json');

    const web3 = new Web3(API_URL); // Replace with your own provider URL
    web3.eth.accounts.wallet.add(PRIVATE_KEY);
    const tokenAddress = '0x8312Bd7F944B5aebeE20CFd2E2c76562938792db'; // Replace with the address of the XXXToken contract
    const tokenContract = new web3.eth.Contract(XXXTokenABI, tokenAddress);

    const spenderAddress = '0x3494a452AF9B601b0742e9FC8931da2E9d61F9fd'; // Replace with the address of the spender
    const amount = web3.utils.toWei('500000', 'ether'); // Replace with the amount of tokens to approve

    // Approve the spender to spend the specified amount of tokens
    await tokenContract.methods.approve(spenderAddress, amount).send(
        { 
            from: "0x464595b93B6Ea445b53089D0b1DFc0a02bD40558",
            gas: 3000000 
        },
        (error,transactionHash)=>{
        if (error) {
            console.error(error);
        } else {
            console.log(transactionHash);
        }
    });
  }

  main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });