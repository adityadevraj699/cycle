import React, { useState, useEffect } from 'react';

function Search() {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);

  // Fetch data from localStorage when the component mounts
  useEffect(() => {
    const storedPayments = JSON.parse(localStorage.getItem('payments')) || [];
    setPayments(storedPayments);
    setFilteredPayments(storedPayments); // Set the initial filtered payments
  }, []);

  // Handle the search functionality
  const handleSearch = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = payments.filter((payment) => {
      // Search by mobile number or time (date)
      const isMatchByMobile = payment.mobile.toLowerCase().includes(lowerCaseQuery);
      const isMatchByDate = payment.time.toLowerCase().includes(lowerCaseQuery);
      return isMatchByMobile || isMatchByDate;
    });
    setFilteredPayments(filtered);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center py-8 relative"
      style={{
        backgroundImage: 'url("https://wallpapercave.com/wp/wp3001112.jpg")', // Add your background image URL here
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay with opacity */}
      <div
        className="absolute inset-0 bg-black opacity-50 z-0"
        style={{
          backgroundImage: 'url("https://wallpapercave.com/wp/wp3001112.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      {/* Fixed Search Bar */}
      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-xl z-10 relative">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Payment Details</h2>

        {/* Search Input */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <input
            type="text"
            className="w-full sm:w-80 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 transition-all"
            placeholder="Search by Mobile Number or Date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="w-full sm:w-32 mt-4 sm:mt-0 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* Scrollable List of Payments */}
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
                <th className="px-6 py-3 text-left">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment, index) => (
                  <tr key={index} className="hover:bg-green-50 transition-all">
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.mobile}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.time}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payment.bicycles.map((bicycle, idx) => (
                        <div key={idx} className="text-sm">
                          {bicycle.type} - {bicycle.quantity} rented = {bicycle.rate}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.securityMoney}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.totalPrice}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
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
