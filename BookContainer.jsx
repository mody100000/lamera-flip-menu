import React, { useRef, useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Bookmark } from 'lucide-react';
import Chapter1 from './src/components/Chapter1';
import Chapter2 from './src/components/Chapter2';
import Discovery from './src/components/Discovery';
import Page from './src/Page';
import useSearchParam from './src/hooks/usePreservedSearchParam';

const BookContainer = () => {
    const book = useRef();
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [tabNumber, setTabNumber] = useSearchParam("tabNumber", 2)
    const [isBookReady, setIsBookReady] = useState(false);

    const pages = [
        { content: <Chapter1 />, number: 1 },
        { content: <Chapter2 />, number: 2 },
        { content: <Discovery />, number: 3 }
    ];

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const setInitialPage = () => {
        if (!book.current || !isBookReady) return;
        setIsFlipping(true)
        book.current.pageFlip().turnToPage(tabNumber - 1);
        setIsFlipping(false)
    };

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Handle book initialization
    useEffect(() => {
        if (dimensions.width > 0 && dimensions.height > 0 && book.current) {
            setIsBookReady(true);
        }
    }, [dimensions.width, dimensions.height, book.current]);

    // Set initial page once book is ready
    useEffect(() => {
        if (isBookReady) {
            // Add a small delay to ensure the book is fully initialized
            setTimeout(setInitialPage, 100);
        }
    }, [isBookReady]);

    const handlePageFlip = async (targetPage) => {
        if (isFlipping || !book.current) return;

        setIsFlipping(true);
        const pageFlip = book.current.pageFlip();
        const flippingTime = 500;
        let currentIndex = pageFlip.getCurrentPageIndex();
        const targetIndex = targetPage - 1;

        // Update tabNumber first to ensure URL sync
        setTabNumber(targetPage);

        while (currentIndex !== targetIndex) {
            const direction = targetIndex > currentIndex ? 1 : -1;
            pageFlip.flip(currentIndex + direction);
            await sleep(flippingTime + 100);
            currentIndex = pageFlip.getCurrentPageIndex();
        }

        setCurrentPage(targetIndex);
        setIsFlipping(false);
    };

    // Add effect to handle tabNumber changes
    useEffect(() => {
        if (isBookReady && !isFlipping) {
            const targetPage = tabNumber - 1;
            if (currentPage !== targetPage) {
                handlePageFlip(tabNumber);
            }
        }
    }, [tabNumber]);

    return (
        <div className="fixed inset-0 bg-amber-50 flex items-center justify-center overflow-hidden" ref={containerRef}>
            <div className="relative w-full h-full">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-4 z-10">
                    {pages.map((page) => (
                        <div
                            key={page.number}
                            className={`group flex items-center gap-2 ${isFlipping ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                            onClick={() => handlePageFlip(page.number)}
                        >
                            <div
                                className={`
                  transition-all duration-300 opacity-0 group-hover:opacity-100 
                  bg-white px-3 py-1 rounded shadow-lg text-sm
                  ${currentPage === page.number - 1 ? 'text-red-500' : 'text-gray-600'}
                `}
                            >
                                Page {page.number}
                            </div>
                            <Bookmark
                                className={`w-6 h-6 transition-colors duration-300
                  ${currentPage === page.number - 1 ? 'text-red-500' : 'text-gray-400'} 
                  hover:text-red-500`}
                            />
                        </div>
                    ))}
                </div>

                {dimensions.width > 0 && dimensions.height > 0 && (
                    <HTMLFlipBook
                        ref={book}
                        width={dimensions.width}
                        height={dimensions.height}
                        size="stretch"
                        minWidth={dimensions.width}
                        maxWidth={dimensions.width}
                        minHeight={dimensions.height}
                        maxHeight={dimensions.height}
                        maxShadowOpacity={1.4}
                        showCover={false}
                        mobileScrollSupport={false}
                        useMouseEvents={false}
                        onFlip={(e) => setCurrentPage(e.data)}
                        flippingTime={500}
                    >
                        {pages.map((page) => (
                            <Page key={page.number} content={page.content} number={page.number} />
                        ))}
                    </HTMLFlipBook>
                )}
            </div>
        </div>
    );
};

export default BookContainer;