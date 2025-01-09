import React, { useState, useEffect } from 'react';

const BookmarkNavigation = ({ spreads, currentSpread, isFlipping, handleSpreadFlip }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [showBookmarks, setShowBookmarks] = useState(false);

    // Detect if the device is mobile
    useEffect(() => {
        const updateIsMobile = () => setIsMobile(window.innerWidth <= 768);
        updateIsMobile();
        window.addEventListener('resize', updateIsMobile);
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

    // Show bookmarks on hover near the top of the screen (desktop only)
    useEffect(() => {
        if (!isMobile) {
            const handleMouseMove = (e) => {
                setShowBookmarks(e.clientY < 60); // Show bookmarks if mouse is near the top
            };
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [isMobile]);

    if (!spreads) return null;

    // Mobile Layout (Unchanged)
    if (isMobile) {
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
                                relative transition-all duration-300 ease-in-out h-[60px]
                                ${currentSpread === spread.spreadNumber - 1
                                    ? 'w-[85px] right-[-20px] bg-gray-200 font-bold writing-horizontal-tb'
                                    : 'w-[40px] h-[70px] -right-[60px] bg-gray-100/60 group-hover:w-[80px] group-hover:right-[-20px] group-hover:bg-gray-200 group-hover:font-bold writing-vertical-rl group-hover:writing-horizontal-tb'
                                }
                                flex items-center justify-start px-3 py-2 cursor-pointer
                                ${isFlipping ? 'pointer-events-none opacity-50' : ''}
                                rounded-l-lg shadow-[-2px_2px_5px_rgba(0,0,0,0.1)]
                                overflow-hidden whitespace-nowrap
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
    }

    // Desktop Layout
    return (
        <div className="fixed top-0 left-0 w-full z-50">
            {/* Bookmarks Container */}
            <div
                className={`
        flex gap-4 py-2 px-4
        bg-black/60 rounded-b-lg shadow-md
        transition-transform duration-300
        ${showBookmarks ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
    `}
            >
                {spreads.map((spread) => (
                    <button
                        key={spread.spreadNumber}
                        onClick={() => !isFlipping && handleSpreadFlip(spread.spreadNumber)}
                        className={`
                px-4 py-1.5 rounded-lg transition-all duration-300
                ${currentSpread === spread.spreadNumber - 1
                                ? 'bg-gray-200 font-bold'
                                : 'bg-gray-100/60 hover:bg-gray-200'
                            }
                ${isFlipping ? 'pointer-events-none opacity-50' : ''}
                cursor-pointer min-w-[100px] text-center
            `}
                    >
                        Spread {spread.spreadNumber}
                    </button>
                ))}
            </div>
        </div>
    );

};

export default BookmarkNavigation;
