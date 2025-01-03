import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation
  const { name, email, mobile, address, bicycles, securityMoney } = location.state || {};
  const [currentTime, setCurrentTime] = useState(null);  // Store current time
  const [isTimeConfirmed, setIsTimeConfirmed] = useState(false); // Flag for confirming the time
  const [paymentDetails, setPaymentDetails] = useState(null); // State to store payment details to display

  // Filter out bicycles with quantity 0
  const filteredBicycles = bicycles.filter(bicycle => bicycle.quantity > 0);

  // Handle button click
  const handleTimeStart = () => {
    const timeNow = new Date().toISOString(); // Get current time in ISO format
    setCurrentTime(timeNow);  // Display the current time
  };

  // Handle confirmation of time and save details to localStorage
  const handleConfirmTime = () => {
    // Construct the cycles object with type names as keys and quantities as values
    const cycles = filteredBicycles.reduce((acc, bicycle, index) => {
      acc[`bicycle type ${index + 1}`] = bicycle.quantity;
      return acc;
    }, {});

    const details = {
      fullName: name,
      email: email,
      phoneNumber: mobile,  // Mobile number corresponds to phoneNumber
      address: address,
      cycles: cycles,
      security: securityMoney,
      timestamp: currentTime,  // Use current time as timestamp
    };

    // Set payment details to display
    setPaymentDetails(details);

    // Send data to backend
    fetch('http://localhost:8000/api/start/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Payment details saved:', data);
        setIsTimeConfirmed(true);
        navigate('/'); // Navigate to the home page after confirming time
      })
      .catch(error => {
        console.error('Error sending payment details:', error);
      });

    // Mark the time as confirmed
    setIsTimeConfirmed(true);
  };

  // Calculate price for each bicycle based on quantity and price per unit
  const calculatePrice = (quantity, pricePerUnit) => quantity * pricePerUnit;

  // Calculate the total price for all selected bicycles
  const calculateTotalPrice = () => {
    return filteredBicycles.reduce((total, bicycle) => {
      return total + calculatePrice(bicycle.quantity, bicycle.rate);
    }, 0);
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://wallpapercave.com/wp/wp3001112.jpg')" }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Payment Details</h2>

        {location.state ? (
          <div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Mobile:</strong> {mobile}</p>
              <p><strong>Address:</strong> {address}</p>
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
              <p>Total Security Money: ₹{securityMoney}</p>
            </div>

            {/* Display the total price for all bicycles */}
            {filteredBicycles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">Total Price for Bicycles</h3>
                <p>Total Price (30 min): ₹{calculateTotalPrice()}</p>
              </div>
            )}

            {/* Show current time */}
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

            {/* If time is not yet selected */}
            {!currentTime && (
              <div className="mt-6">
                <button
                  onClick={handleTimeStart}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Now Time Start
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
}

export default Payment;
