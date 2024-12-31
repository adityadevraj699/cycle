import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function Payment() {
  const location = useLocation();
  const { name, email, mobile, address, bicycles, securityMoney } = location.state || {};
  const [currentTime, setCurrentTime] = useState(null); // Store current time
  const [isTimeConfirmed, setIsTimeConfirmed] = useState(false); // Flag for confirming the time
  const [paymentDetails, setPaymentDetails] = useState(null); // State to store payment details to display
  const [backendResponse, setBackendResponse] = useState(null); // State to handle backend response

  // Filter out bicycles with quantity > 0 and handle cases where bicycles is undefined
  const filteredBicycles = (bicycles || []).filter(bicycle => bicycle.quantity > 0);

  // Handle button click to set the current time
  const handleTimeStart = () => {
    const timeNow = new Date().toISOString(); // Get current time in ISO format
    setCurrentTime(timeNow); // Display the current time
  };

  // Handle confirmation of time and save details to backend
  const handleConfirmTime = () => {
    const cycles = filteredBicycles.reduce((acc, bicycle, index) => {
      acc[`bicycle type ${index + 1}`] = bicycle.quantity;
      return acc;
    }, {});

    const details = {
      fullName: name,
      email: email,
      phoneNumber: mobile,
      address: address,
      cycles: cycles,
      security: securityMoney,
      timestamp: currentTime, // Use current time as timestamp
    };

    console.log("Details sent to backend:", details); // Debug log
    setPaymentDetails(details);

    fetch('http://localhost:8000/api/end/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from backend:', data);
        setBackendResponse(data);
        setIsTimeConfirmed(true);
      })
      .catch(error => {
        console.error('Error sending payment details:', error);
      });
  };

  // Calculate price for each bicycle based on quantity and price per unit
  const calculatePrice = (quantity, pricePerUnit) => quantity * pricePerUnit;

  // Calculate the total price for all selected bicycles
  const calculateTotalPrice = () => {
    return filteredBicycles.reduce((total, bicycle) => {
      return total + calculatePrice(bicycle.quantity, bicycle.rate);
    }, 0);
  };

  // // If no data is passed, show an error message
  // if (!location.state || !bicycles) {
  //   return (
  //     <div>
  //       <h1>Error</h1>
  //       <p>No data available. Please try again.</p>
  //     </div>
  //   );
  // }

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://wallpapercave.com/wp/wp3001112.jpg')" }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Payment Details</h2>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
          <p><strong>Name:</strong> {name || 'Not provided'}</p>
          <p><strong>Email:</strong> {email || 'Not provided'}</p>
          <p><strong>Mobile:</strong> {mobile || 'Not provided'}</p>
          <p><strong>Address:</strong> {address || 'Not provided'}</p>
        </div>

        {/* Bicycle Selection Table */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Bicycle Selection</h3>
          {filteredBicycles.length > 0 ? (
            <table className="min-w-full mt-4 border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Bicycle Type</th>
                  <th className="px-4 py-2 text-left">Quantity Rented</th>
                  <th className="px-4 py-2 text-left">Price per Bicycle (30min)</th>
                  <th className="px-4 py-2 text-left">Total Price (30min)</th>
                </tr>
              </thead>
              <tbody>
                {filteredBicycles.map((bicycle, index) => {
                  const totalPrice = calculatePrice(bicycle.quantity, bicycle.rate);
                  return (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{bicycle.type}</td>
                      <td className="px-4 py-2">{bicycle.quantity}</td>
                      <td className="px-4 py-2">₹{bicycle.rate}</td>
                      <td className="px-4 py-2">₹{totalPrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No bicycles selected for rental.</p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Security Money</h3>
          <p>Total Security Money: ₹{securityMoney || 'Not specified'}</p>
        </div>

        {filteredBicycles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Total Price for Bicycles</h3>
            <p>Total Price (30 min): ₹{calculateTotalPrice()}</p>
          </div>
        )}

        {currentTime && !isTimeConfirmed && (
          <div className="mt-6">
            <p><strong>Current Time:</strong> {currentTime}</p>
            <button
              onClick={handleConfirmTime}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Confirm Time
            </button>
          </div>
        )}

        {backendResponse && (
          <div className="mt-6 bg-green-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">Backend Response</h3>
            <p><strong>Success:</strong> {backendResponse.success ? 'Payment confirmed!' : 'Payment failed.'}</p>
            {backendResponse.totalPrice !== undefined && (
              <p><strong>Total Price:</strong> ₹{backendResponse.totalPrice}</p>
            )}
            {backendResponse.remainingBalance !== undefined && (
              <p><strong>Remaining Balance:</strong> ₹{backendResponse.remainingBalance}</p>
            )}
            {Object.entries(backendResponse).map(([key, value]) => (
              key !== 'success' && key !== 'totalPrice' && key !== 'remainingBalance' && (
                <p key={key}><strong>{key}:</strong> {value}</p>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
