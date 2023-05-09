import React, { useEffect, useState, useContext } from "react";
import millify from "millify";

import getTimeUntil from "../utils/getTimeUntil";
import SaleEndTimer from "./SaleEndTimer";
import GlobalContext from "../context/GlobalContext";

const SaleEnds = () => {
  const { handleConnectWallet, icoState } = useContext(GlobalContext);
  // const tokensAvailableInPerc = (icoState.tokensAvailable / 5000000) * 100;

  const [timer, setTimer] = useState({
    icoEndDate: "Wednesday, 10 May 2023 00:00:00 GMT+00:00",
    days: "0",
    hours: "0",
    minutes: "0",
    seconds: "0",
  });

  useEffect(() => {
    setInterval(() => handleGetTimeUntil(timer.icoEndDate), 1000);
  }, []);

  function handleGetTimeUntil(icoEndDate) {
    if (getTimeUntil(icoEndDate)) {
      const { days, hours, minutes, seconds } = getTimeUntil(icoEndDate);

      setTimer({
        icoEndDate: timer.icoEndDate,
        days,
        hours,
        minutes,
        seconds,
      });
    }
  }

  return (
    <div className="sale-ends-container">
      <div className="card text-center">
        <div className="p-10">
          <div>TOKEN SALE ENDS IN</div>

          {/* Time Limit*/}
          <div className="flex m-4 gap-3 justify-center">
            <SaleEndTimer
              time={timer.days}
              text={timer.days > 1 ? "Days" : "Day"}
            />
            <SaleEndTimer
              time={timer.hours}
              text={timer.hours > 1 ? "Hours" : "Hour"}
            />
            <SaleEndTimer
              time={timer.minutes}
              text={timer.minutes > 1 ? "Minutes" : "Minute"}
            />
            <SaleEndTimer
              time={timer.seconds}
              text={timer.seconds > 1 ? "Seconds" : "Second"}
            />
          </div>

          {/* Tokens Available */}
          
        </div>
      </div>
    </div>
  );
};

export default SaleEnds;
