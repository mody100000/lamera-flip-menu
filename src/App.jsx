import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookContainer from '../BookContainer';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';
import Dashboard from './Dashboard/Dashboard';

const App = () => {
  return (
    <div className="h-screen w-screen">
      <Toaster richColors />
      <CartProvider>
        <Router>
          <Routes>
            {/* Default route for the BookContainer */}
            <Route path="/" element={<BookContainer />} />

            {/* Example of another route */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </CartProvider>
    </div>
  );
};

export default App;
