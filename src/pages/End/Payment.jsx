import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentDetails = location.state?.paymentDetails;

  // Function to handle the POST request
  const handleComplete = async () => {
    if (!paymentDetails?.phoneNumber) {
      alert('Phone number is missing!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/delete/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: paymentDetails.phoneNumber }),
      });
      console.log(paymentDetails.phoneNumber)

      if (response.ok) {
        alert('Thank you for completing the payment!');
        navigate('/'); // Redirect to home or another page
      } else {
        alert('Failed to send request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending the request.');
    }
  };

  // Check if payment details are missing
  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Payment Details Available</h2>
          <p className="text-gray-600">
            Please return to the previous page and ensure payment information is submitted correctly.
          </p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    if (amount !== undefined && amount !== null) {
      return `₹${amount.toFixed(2)}`;
    }
    return '₹0.00'; // Return 0 if the amount is undefined or null
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 bg-gray-100">
      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Payment Summary</h2>
        <div className="text-gray-700 space-y-4">
          <p>
            <strong className="text-gray-900">Name:</strong> {paymentDetails.userDetails.fullName || 'N/A'}
          </p>
          <p>
            <strong className="text-gray-900">Email:</strong> {paymentDetails.userDetails.email || 'N/A'}
          </p>
          <p>
            <strong className="text-gray-900">Phone Number:</strong> {paymentDetails.phoneNumber || 'N/A'}
          </p>
          <p>
            <strong className="text-gray-900">Security Money:</strong>{' '}
            {formatCurrency(paymentDetails.userDetails.security)}
          </p>
          <p>
            <strong className="text-gray-900">Remaining Balance:</strong>{' '}
            {formatCurrency(paymentDetails.userDetails.remainingBalance)}
          </p>
        </div>
        {/* Complete button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleComplete}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
