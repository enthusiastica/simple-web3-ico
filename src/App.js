import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import loadContract from "./utils/loadContract";
import {
  HomeScreen,
  TokenScreen,
  FaqScreen,
  ContactScreen,
  LoadingScreen,
  ErrorScreen,
  TokenDistScreen,
  FaucetScreen,
  TransactionScreen,
} from "./screens";
import Header from "./components/Header";
import GlobalContext from "./context/GlobalContext";
import connectWallet from "./utils/connectWallet";
import Footer from "./components/Footer";
import SaleEnds from "./components/SaleEnds";
import Circle from "./components/Circle";
import millify from "millify";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import {icoAddress} from "./utils/constants";

import TransactionToast from "./components/TransactionToast";
import handleError from "./utils/handleError";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState({
    address: null,
    balance: null,
    chainID: null,
  });

  const [contract, setContract] = useState(null);
  const [icoState, setIcoState] = useState({
    tokensAvailable: null,
    investorBalance: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
      handleConnectWallet();
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleConnectWallet = async () => {
    const { _provider, _signer, _address, _balance, _chainId } =
      await connectWallet(handleConnectWallet);
    const { tokensAvailable, investorBalance } = await loadContract(
      _signer,
      _chainId,
      setContract,
      _address
    );
    setProvider(_provider);
    setSigner(_signer);
    setAccount({
      address: _address,
      balance: _balance,
      chainID: _chainId,
    });

    setIcoState({
      tokensAvailable,
      investorBalance,
    });
  };

  //functions for token buy
  const [userAmount, setUserAmount] = useState("");

  const handleBuy = async () => {
    if (!signer) {
      handleConnectWallet();
      return;
    }

    try {
      console.log("App.js-91, start deposit");
      // const tx = await contract.stknICO.invest({
      //   value: ethers.utils.parseEther((0.0001 * userAmount).toString()),
      // });
      // const result = await contract.stknICO.approve(icoAddress, (0.002*userAmount*10**18).toString());
      // console.log("App.js-96, approve result: ", result);
      const tx = await contract.ico.deposit({'value': (0.001*userAmount*10**18).toString(), gasLimit:100000}).send();
      console.log("App.js-95, ");
      setUserAmount("");
      toast.success(
        <TransactionToast
          userAmount={userAmount}
          hash={tx.hash}
          text="Placed Buy request for"
          text2="Please Wait Few Mins for confirmation"
        />
      );

      await tx.wait();

      toast.success(
        <TransactionToast
          userAmount={userAmount}
          hash={tx.hash}
          text="Purchased"
        />
      );
      handleConnectWallet();
    } catch (error) {
      handleError(error, "STKN");
    }
  };
  //

  function TokenBuy() {
    return (
      <div>
        <div className="card mt-8 sm:mt-0">
          <div className="text-2xl text-center p-4">Token Buy</div>
        </div>

        <div className="card">
          <div className="flex justify-center items-center flex-col">
            <div className="m-3">Price: 0.001 BNB</div>
            <input
              className="input"
              type="number"
              min={10}
              max={50}
              placeholder="No. of BNB Tokens..."
              value={userAmount}
              onChange={(e) => {
                setUserAmount(e.target.value);
              }}
            />
            {userAmount >= 10 && userAmount <= 50 ? (
              <div className="mb-3 text-green-500">
                Total Pay:{" "}
                {millify(0.001 * userAmount, {
                  precision: 4,
                })}{" "}
                BNB
              </div>
            ) : null}
            {userAmount < 10 && userAmount !== "" ? (
              <div className="text-red-500 mb-3">Min Tokens: 10 </div>
            ) : null}
            {userAmount > 50 ? (
              <div className="text-red-500 mb-3">Max Tokens: 50 </div>
            ) : null}

            <button className="btn mb-3 text-[1.15rem]" onClick={handleBuy}>
              {provider ? "Buy" : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="app-wrapper">
      <GlobalContext.Provider
        value={{
          provider,
          setProvider,
          signer,
          setSigner,
          account,
          setAccount,
          handleConnectWallet,
          contract,
          setContract,
          icoState,
          setIcoState,
          loading,
          setLoading,
        }}
      >
        {!loading ? (
          <div className="">
            <Header />
            <ToastContainer
              position="top-center"
              theme="dark"
              toastStyle={{
                backgroundColor: "#1e40af",
                fontWeight: "bold",
                fontFamily: "poppins",
                borderRadius: "5rem",
              }}
            />
            <div className="screen-wrapper">
              <div className="md:ml-6 md:flex md:h-[80vh] md:items-center">
                <div className="flex justify-center items-center w-full">
                  <div className="flex justify-center items-center w-full">
                    <div className="flex flex-col w-full items-center md:mr-5">
                      <div className="card mt-4">
                        <div className="text-2xl text-center p-4">ICO Details</div>
                      </div>
                      <Circle />
                    </div>
                  </div>
                  <TokenBuy/>
                </div>
              </div>
              <div className="flex justify-center items-center w-full">
                <SaleEnds />
              </div>
            </div>
            <div className="flex justify-center items-end">
              <Footer />
            </div>
          </div>
        ) : (
          <LoadingScreen />
        )}
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
