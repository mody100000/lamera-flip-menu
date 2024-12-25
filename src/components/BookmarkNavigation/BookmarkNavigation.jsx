import React, { useState, useEffect } from 'react';
import { Bookmark as BookmarkIcon } from 'lucide-react';

const BookmarkNavigation = ({ spreads, currentSpread, isFlipping, handleSpreadFlip }) => {
    const [isMobile, setIsMobile] = useState(false);

    // Detect if the device is mobile
    useEffect(() => {
        const updateIsMobile = () => setIsMobile(window.innerWidth <= 768);
        updateIsMobile();
        window.addEventListener('resize', updateIsMobile);
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

    if (!spreads) return null; // Guard clause to prevent mapping errors

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50">
            {spreads.map((spread) => (
                <div
                    key={spread.spreadNumber}
                    className="group relative"
                    onClick={() => !isFlipping && handleSpreadFlip(spread.spreadNumber)}
                >
                    <button
                        className={`
                            relative
                            transition-all duration-300 ease-in-out
                            h-[60px]
                            ${currentSpread === spread.spreadNumber - 1
                                ? 'w-[85px] right-[-20px] bg-gray-200 font-bold writing-horizontal-tb'
                                : 'w-[40px] h-[70px] -right-[60px] bg-gray-100/60 group-hover:w-[80px] group-hover:right-[-20px] group-hover:bg-gray-200 group-hover:font-bold writing-vertical-rl group-hover:writing-horizontal-tb'
                            }
                            flex items-center justify-start
                            px-3 py-2
                            cursor-pointer
                            ${isFlipping ? 'pointer-events-none opacity-50' : ''}
                            rounded-l-lg
                            shadow-[-2px_2px_5px_rgba(0,0,0,0.1)]
                            overflow-hidden whitespace-nowrap
                            before:content-['']
                            before:absolute before:inset-0
                            before:bg-gradient-to-r before:from-white/10 before:to-transparent
                            before:rounded-l-lg
                        `}
                    >
                        <span className={`transition-transform duration-300 
                            ${currentSpread === spread.spreadNumber - 1
                                ? 'rotate-0'
                                : 'rotate-180 group-hover:rotate-0'
                            }`}
                        >
                            Spread {spread.spreadNumber}
                        </span>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BookmarkNavigation;