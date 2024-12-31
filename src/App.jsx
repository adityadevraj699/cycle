import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Start from './pages/Start/Start';
import Search from './pages/End/Search.jsx';
import Payment from './pages/Start/Payment.jsx';
import PaymentDetails from './pages/End/Payment';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<Start />} />
          <Route path="/search" element={<Search />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-details" element={<PaymentDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
