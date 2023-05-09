const { API_URL, PRIVATE_KEY} = process.env;

const Web3 = require('web3');
const web3 = new Web3(API_URL); // Replace with your Infura project ID

const privateKey =PRIVATE_KEY; // Replace with your private key
const fromAddress = '0x464595b93B6Ea445b53089D0b1DFc0a02bD40558'; // Replace with your Ethereum address
const toAddress = '0xA7E8c6AEB301A21d4d7A2c74718176663fB83e83'; // Replace with the recipient's Ethereum address
const amount = web3.utils.toWei('0.1', 'ether'); // Replace with the amount of ether you want to send

async function main() {
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 21000;
    const nonce = await web3.eth.getTransactionCount(fromAddress);

    const tx = {
    from: fromAddress,
    to: toAddress,
    value: amount,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    nonce: nonce
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`Transaction hash: ${txHash}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });