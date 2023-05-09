import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import {Col, Row} from 'antd';

import loadContract from "./utils/loadContract";
import {
  LoadingScreen,
} from "./screens";
import Header from "./components/Header";
import GlobalContext from "./context/GlobalContext";
import connectWallet from "./utils/connectWallet";
import SaleEnds from "./components/SaleEnds";
import Progressbar from './components/progressbar';
import Circle from "./components/Circle";
import millify from "millify";
import { toast } from "react-toastify";

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
          <div>
            <Header />
            <Row>
              <Col span={8}>
                <div className="flex justify-left items-center w-full">
                  <div className="flex flex-col w-full items-center md:mr-5">
                    <div className="card mt-4">
                      <div className="text-2xl text-center p-4">ICO Details</div>
                    </div>
                    <Circle />
                  </div>
                </div>
              </Col>
              <Col style={{marginTop: "20px"}} span={16}>
                <Row>
                  <Col span={13}>
                    <div className="flex justify-left items-center w-full">
                      <SaleEnds />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="flex justify-right items-right w-full">
                      <TokenBuy/>
                    </div>
                  </Col>
                </Row>
                <Progressbar softcap = {0.1} hardcap = {1}></Progressbar>
              </Col>
            </Row>
            </div>
        ) : (
          <LoadingScreen />
        )}
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
