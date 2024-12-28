import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Start() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    bicycles: [
      { type: 'Bicycle 1', rate: 30, quantity: 0, image: 'https://tse1.mm.bing.net/th?id=OIP.r9Bh4oek-EhYzT4qGroktgHaGd&pid=Api&P=0&h=180' },
      { type: 'Bicycle 2', rate: 60, quantity: 0, image: 'https://tse1.mm.bing.net/th?id=OIP.uqgMMrDguDQjZktvjWxzcAHaGB&pid=Api&P=0&h=180' },
      { type: 'Bicycle 3', rate: 120, quantity: 0, image: 'https://tse3.mm.bing.net/th?id=OIP.EElXjLiglIrIW9bEsBVgLAHaHa&pid=Api&P=0&h=180' },
    ],
  });

  const navigate = useNavigate();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuantityChange = (index, change) => {
    setFormData(prevFormData => {
      // Calculate the new quantity
      const newQuantity = prevFormData.bicycles[index].quantity + change;

      // Only update if the new quantity is not negative
      if (newQuantity < 0) {
        return prevFormData;
      }

      // Update the state with the new quantity for the specific bicycle
      const updatedBicycles = [...prevFormData.bicycles];
      updatedBicycles[index] = { ...updatedBicycles[index], quantity: newQuantity };

      return { ...prevFormData, bicycles: updatedBicycles };
    });
  };

  const calculateSecurityMoney = () => {
    return formData.bicycles.reduce((total, bicycle) => {
      return total + (bicycle.quantity * 500);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if at least one bicycle has a quantity greater than 0
    const isBicycleSelected = formData.bicycles.some(bicycle => bicycle.quantity > 0);
    
    if (!isBicycleSelected) {
      alert("Please select at least one bicycle before submitting.");
      return; // Prevent form submission
    }

    const securityMoney = calculateSecurityMoney();
    const finalData = { ...formData, securityMoney };
    console.log('Form submitted:', finalData);

    // Navigate to the Payment component with form details
    navigate('/payment', { state: finalData });
  };

  return (
    <div
      className="min-h-3.5 p-2 bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: "url('https://wallpapercave.com/wp/wp3001112.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 p-5 rounded-lg shadow-lg flex flex-col space-y-6"
        style={{
          width: '80%',
          height: '60%',
        }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Rent a Cycle</h2>

        <div className="flex flex-col space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="name" className="block font-semibold text-gray-800">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="email" className="block font-semibold text-gray-800">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="mobile" className="block font-semibold text-gray-800">Mobile</label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="address" className="block font-semibold text-gray-800">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto">
          {formData.bicycles.map((bicycle, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow"
            >
              <img
                src={bicycle.image}
                alt={bicycle.type}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{bicycle.type}</p>
                <p className="text-sm text-gray-600">Rate: ${bicycle.rate} / 30 min</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(index, -1)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  -
                </button>
                <span className="px-4 py-1 border rounded">{bicycle.quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(index, 1)}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Next
        </button>
      </form>
    </div>
  );
}

export default Start;
