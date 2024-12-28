import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Payment() {
  const location = useLocation();
  const { name, email, mobile, address, bicycles = [], securityMoney, time } = location.state || {};
  const [currentTime, setCurrentTime] = useState(null);
  const [isTimeConfirmed, setIsTimeConfirmed] = useState(false);
  const [extraCharge, setExtraCharge] = useState(0);
  const [totalCharge, setTotalCharge] = useState(0);
  const [balance, setBalance] = useState(0);

  // Calculate extra charge based on the time passed
  const calculateExtraCharge = () => {
    if (!time) return;

    const currentTime = new Date();
    const paymentTime = new Date(time);
    const timeDiff = Math.floor((currentTime - paymentTime) / 60000); // Difference in minutes

    if (timeDiff > 30) {
      let totalExtraCharge = 0;
      bicycles.forEach((bicycle) => {
        const extraTime = Math.floor(timeDiff / 30); // Charge every 30 minutes
        totalExtraCharge += extraTime * bicycle.quantity * 30; // Charge per 30 minutes for each bicycle
      });
      setExtraCharge(totalExtraCharge);
    } else {
      setExtraCharge(0);
    }
  };

  useEffect(() => {
    if (time) {
      calculateExtraCharge();
    }
    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [time]);

  useEffect(() => {
    // Calculate total charge and balance whenever extra charge or security money changes
    const total = securityMoney + extraCharge;
    setTotalCharge(total);

    const balanceAmount = securityMoney - total;
    setBalance(balanceAmount);
  }, [extraCharge, securityMoney]);

  const filteredBicycles = bicycles.filter(bicycle => bicycle.quantity > 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800">Payment Details</h2>

      {location.state ? (
        <div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Mobile:</strong> {mobile}</p>
            <p><strong>Address:</strong> {address}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold text-gray-800">Bicycle Selection</h3>
            {filteredBicycles.length > 0 ? (
              filteredBicycles.map((bicycle, index) => (
                <div key={index} className="mt-2">
                  <p>{bicycle.type} - {bicycle.quantity} rented</p>
                </div>
              ))
            ) : (
              <p>No bicycles selected for rental.</p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold text-gray-800">Security Money</h3>
            <p>Total Security Money: ${securityMoney}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold text-gray-800">Extra Charges</h3>
            <p>Extra Charge for time over 30 minutes: ${extraCharge}</p>
          </div>

          <div className="mt-4">
            <p><strong>Payment Time:</strong> {time}</p>
          </div>

          {/* Show current time */}
          {currentTime && !isTimeConfirmed && (
            <div className="mt-4">
              <p><strong>Current Time:</strong> {currentTime}</p>
              <button
                onClick={() => setIsTimeConfirmed(true)}
                className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Confirm Payment
              </button>
            </div>
          )}

          {isTimeConfirmed && (
            <div className="mt-4 text-green-600">
              <p>Payment confirmed with extra charge applied!</p>
              <p>Total Charge: ${totalCharge}</p>
              <p>Balance: ${balance < 0 ? `You owe $${Math.abs(balance)}` : `You will receive $${Math.abs(balance)}`}</p>
            </div>
          )}
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}

export default Payment;
