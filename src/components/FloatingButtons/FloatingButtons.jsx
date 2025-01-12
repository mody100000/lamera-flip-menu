import React, { useState, useEffect } from 'react';
import { ShoppingCart, CreditCard } from 'lucide-react';

const FloatingButtons = ({ handleShowCartModal, handleShowCheckoutModal }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [showButtons, setShowButtons] = useState(false);

    // Detect if device is mobile
    useEffect(() => {
        const updateIsMobile = () => setIsMobile(window.innerWidth <= 768);
        updateIsMobile();
        window.addEventListener('resize', updateIsMobile);
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

    // Show buttons when user hovers at the bottom of the screen (desktop only)
    useEffect(() => {
        if (!isMobile) {
            const handleMouseMove = (e) => {
                const windowHeight = window.innerHeight;
                if (windowHeight - e.clientY < 100) {
                    setShowButtons(true);
                } else {
                    setShowButtons(false);
                }
            };
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [isMobile]);

    // Mobile Layout
    if (isMobile) {
        return (
            <div className="absolute right-4 bottom-4 space-y-4 z-10">
                <button
                    onClick={handleShowCartModal}
                    className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-gray-100 hover:scale-110 transition-all duration-300"
                >
                    <ShoppingCart className="w-6 h-6" />
                </button>
                <button
                    onClick={handleShowCheckoutModal}
                    className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-gray-100 hover:scale-110 transition-all duration-300"
                >
                    <CreditCard className="w-6 h-6" />
                </button>
            </div>
        );
    }

    // Desktop Layout
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10">
            <div
                className={`
                    bg-black/80 rounded-lg shadow-lg
                    flex gap-4 py-2 px-4
                    transition-all duration-300 ease-in-out
                    ${showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
            >
                <button
                    onClick={handleShowCartModal}
                    className="px-6 py-2 rounded-lg bg-white/70 hover:bg-gray-100 flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                </button>
                <button
                    onClick={handleShowCheckoutModal}
                    className="px-6 py-2 rounded-lg bg-white/70 hover:bg-gray-100 flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                    <CreditCard className="w-5 h-5" />
                    <span>Checkout</span>
                </button>
            </div>
        </div>
    );
};

export default FloatingButtons;