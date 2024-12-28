// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-[url('https://wallpapercave.com/wp/wp3001112.jpg')] flex items-center justify-center p-5 text-white">
      <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-bold">Cycle Management System</h1>
        <p className="text-lg sm:text-2xl">Manage your cycle activities effortlessly!</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link to="/start">
            <button className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg shadow-lg text-lg font-semibold transition duration-300">
              Start
            </button>
          </Link>
          <Link to="/search">
            <button className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg shadow-lg text-lg font-semibold transition duration-300">
              End
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
