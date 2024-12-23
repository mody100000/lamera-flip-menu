import React from 'react';
import BookContainer from '../BookContainer';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <div className="h-screen w-screen">
      <Toaster richColors />
      <CartProvider>
        <BookContainer />
      </CartProvider>
    </div>
  );
};

export default App;