import { ethers } from "ethers";
import { stakingICOAddress, stakingICOAbi, icoAddress, icoAbi } from "./constants";
import { toast } from "react-toastify";

async function loadContract(signer, chainId, setContract, address) {
  if (chainId !== 97) {
    toast.error(
      "Please Change your network to Binance Test Network for Buying Tokens"
    );
    return;
  }
  const _stknICOContract = new ethers.Contract(
    stakingICOAddress,
    stakingICOAbi,
    signer
  );

  const _icoContract = new ethers.Contract(
    icoAddress,
    icoAbi,
    signer
  );

  setContract({
    stknICO: _stknICOContract,
    ico : _icoContract
  });

  //Read From Contract

  const tokensAvailable = ethers.utils.formatEther(
    await _stknICOContract.balanceOf(stakingICOAddress)
  );

  const investorBalance = ethers.utils.formatEther(
    await _stknICOContract.balanceOf(address)
  );

  return {
    tokensAvailable,
    investorBalance,
  };
}

export default loadContract;
