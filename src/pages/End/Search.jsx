import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Search() {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/search/all')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        return response.json();
      })
      .then((data) => {
        setPayments(data.users || []);
        setFilteredPayments(data.users || []);
      })
      .catch((error) => {
        console.error('Error fetching payments:', error);
      });
  }, []);

  const handleSearch = () => {
    fetch(`http://localhost:8000/api/search/user?query=${searchQuery}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setFilteredPayments(data.users || []);
        } else {
          alert('No users found');
          setFilteredPayments([]);
        }
      })
      .catch((error) => {
        console.error('Error searching payments:', error);
        alert('Error connecting to the server.');
      });
  };

  const navigate = useNavigate();

  const handleEndClick = (payment) => {
    const currentTime = new Date().toISOString();

    fetch('http://localhost:8000/api/end/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: payment.phoneNumber,
        endTime: currentTime,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // alert(`End Successful! Total Price: ₹${data.totalPrice}, Remaining Balance: ₹${data.remainingBalance}`);
          navigate('/payment-details', { state: { paymentDetails: data } });
        } else {
          alert(`Error: ${data.message}. Remaining Balance: ₹${data.remainingBalance || 'N/A'}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error connecting to the server.');
      });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center py-8 relative"
      style={{
        backgroundImage: 'url("https://wallpapercave.com/wp/wp3001112.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="absolute inset-0 bg-black opacity-50 z-0"
        style={{
          backgroundImage: 'url("https://wallpapercave.com/wp/wp3001112.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-xl z-10 relative">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Payment Details</h2>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <input
            type="text"
            className="w-full sm:w-80 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 transition-all"
            placeholder="Search by Mobile Number or Date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="py-3 px-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all"
            >
              Search
            </button>
            <button
              onClick={() => setFilteredPayments(payments)}
              className="py-3 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
            >
              Show All
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-xl overflow-y-auto max-h-[60vh] mt-2 z-10 relative">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-sm">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Mobile</th>
                <th className="px-6 py-3 text-left">Time</th>
                <th className="px-6 py-3 text-left">Bicycles</th>
                <th className="px-6 py-3 text-left">Security Money</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment, index) => (
                  <tr key={index} className="hover:bg-green-50 transition-all">
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(payment.startTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payment.cycles && typeof payment.cycles === 'object'
                        ? Object.entries(payment.cycles).map(([type, quantity], idx) => (
                            <div key={idx} className="text-sm">
                              {type} - {quantity} rented
                            </div>
                          ))
                        : 'No bicycles rented'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.security || 'N/A'}</td>
                    {/* <td className="px-6 py-4 text-sm text-gray-700">
                      {typeof payment.security === 'number' &&
                      payment.cycles &&
                      typeof payment.cycles === 'object'
                        ? payment.security + Object.values(payment.cycles).reduce((a, b) => a + b, 0) * 100
                        : 'N/A'}
                    </td> */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <button
                        onClick={() => handleEndClick(payment)}
                        className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        End
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Search;
