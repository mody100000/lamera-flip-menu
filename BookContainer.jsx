import React, { useRef, useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { CreditCard, ShoppingCart, Star } from 'lucide-react';
import useSearchParam from './src/hooks/usePreservedSearchParam';
import { useCart } from './src/context/CartContext';
import Menu from './src/components/Menu/Menu';
import BookmarkNavigation from './src/components/BookmarkNavigation/BookmarkNavigation';
import Menu2 from './src/components/Menu2/Menu2';
import Menu3 from './src/components/Menu3/Menu3';
import Menu4 from './src/components/Menu4/Menu4';
import foodImg from "@assets/burger.webp";
import { toast } from 'sonner';
import EnhancedFoodModal from './src/components/FoodModal/FoodModal';
// Create a Page component for individual pages
const Page = React.forwardRef(({ position, children }, ref) => {
    return (
        <div ref={ref} className="relative w-full h-full bg-white">
            {/* Spine shadow */}
            <div
                className={`absolute inset-y-0 pointer-events-none ${position === 'left'
                    ? 'right-0 w-24 bg-gradient-to-l from-black/20 via-black/10 to-transparent'
                    : 'left-0 w-24 bg-gradient-to-r from-black/20 via-black/10 to-transparent'
                    }`}
            />
            {children}
        </div>
    );
});

const BookContainer = () => {
    const book = useRef();
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [currentSpread, setCurrentSpread] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [spreadNumber, setSpreadNumber] = useSearchParam("spreadNumber", 1);
    const [isBookReady, setIsBookReady] = useState(false);
    const [showFloatingButtons] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const [showFoodModal, setShowFoodModal] = useState(false);
    const [detectedText, setDetectedText] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('Medium');
    const { addToCart, setShowCartModal, setShowCheckoutModal } = useCart();

    const sizes = ['Small', 'Medium', 'Large'];
    const price = 120.99;
    const rating = 4;

    const handleTextDetected = (text) => {
        setDetectedText(text);
        setShowFoodModal(true);
    };

    const handleCloseModal = () => {
        setShowFoodModal(false);
        setDetectedText('');
        setQuantity(1);
        setSelectedSize('Medium');
    };

    const addToCartHandler = () => {
        const newItem = {
            id: Date.now(),
            name: detectedText,
            size: selectedSize,
            quantity: quantity,
            price: price,
            image: foodImg
        };

        addToCart(newItem);
        toast.success('تمت إضافة العنصر إلى السلة', {
            position: 'top-right',
            duration: 2000
        });
        handleCloseModal();
    };

    // Define spreads for desktop
    const desktopSpreads = [
        { leftContent: <Menu2 onTextDetected={handleTextDetected} />, rightContent: <Menu4 onTextDetected={handleTextDetected} />, spreadNumber: 1 },
        { leftContent: <Menu onTextDetected={handleTextDetected} />, rightContent: <Menu3 onTextDetected={handleTextDetected} />, spreadNumber: 2 }
    ];

    // Define spreads for mobile
    const mobileSpreads = [
        { leftContent: <Menu2 onTextDetected={handleTextDetected} />, rightContent: null, spreadNumber: 1 },
        { leftContent: <Menu4 onTextDetected={handleTextDetected} />, rightContent: null, spreadNumber: 2 },
        { leftContent: <Menu onTextDetected={handleTextDetected} />, rightContent: null, spreadNumber: 3 },
        { leftContent: <Menu3 onTextDetected={handleTextDetected} />, rightContent: null, spreadNumber: 4 }
    ];

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const setInitialSpread = () => {
        if (!book.current || !isBookReady) return;
        setIsFlipping(true);
        // Multiply by 2 for desktop spreads, keep as is for mobile
        const pageIndex = (spreadNumber - 1) * (isMobile ? 1 : 2);
        book.current.pageFlip().turnToPage(pageIndex);
        setIsFlipping(false);
    };

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const width = window.innerWidth;
                const height = window.innerHeight;
                setDimensions({
                    width: Math.floor(width / (width <= 768 ? 1 : 2)), // Adjust width for mobile
                    height: height,
                });
                setIsMobile(width <= 768);
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (dimensions.width > 0 && dimensions.height > 0 && book.current) {
            setIsBookReady(true);
        }
    }, [dimensions.width, dimensions.height, book.current]);

    useEffect(() => {
        if (isBookReady) {
            setTimeout(setInitialSpread, 100);
        }
    }, [isBookReady]);

    const handleSpreadFlip = async (targetSpread) => {
        if (isFlipping || !book.current) return;

        setIsFlipping(true);
        const pageFlip = book.current.pageFlip();
        const flippingTime = 500;
        let currentIndex = pageFlip.getCurrentPageIndex();
        // Multiply by 2 for desktop spreads, keep as is for mobile
        const targetIndex = (targetSpread - 1) * (isMobile ? 1 : 2);

        setSpreadNumber(targetSpread);

        while (currentIndex !== targetIndex) {
            const direction = targetIndex > currentIndex ? (isMobile ? 1 : 2) : (isMobile ? -1 : -2);
            pageFlip.flip(currentIndex + direction);
            await sleep(flippingTime + 100);
            currentIndex = pageFlip.getCurrentPageIndex();
        }

        setCurrentSpread(isMobile ? targetIndex : Math.floor(targetIndex / 2));
        setIsFlipping(false);
    };

    useEffect(() => {
        if (isBookReady && !isFlipping) {
            if (currentSpread !== spreadNumber - 1) {
                handleSpreadFlip(spreadNumber);
            }
        }
    }, [spreadNumber]);

    const handleShowCartModal = () => {
        setShowCartModal(true);
        setShowCheckoutModal(false);
    };

    const handleShowCheckoutModal = () => {
        setShowCheckoutModal(true);
        setShowCartModal(false);
    };

    // Use appropriate spreads based on device type
    const spreads = isMobile ? mobileSpreads : desktopSpreads;
    const renderStars = (count) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                className={`inline-block ${index < count ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                size={24}
            />
        ));
    };
    return (
        <div className="fixed inset-0 bg-amber-50 flex items-center justify-center overflow-hidden" ref={containerRef}>
            <div className="relative w-full h-full">
                {/* Bookmark Navigation */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-4 z-10">
                    <BookmarkNavigation
                        spreads={spreads}
                        currentSpread={currentSpread}
                        isFlipping={isFlipping}
                        handleSpreadFlip={handleSpreadFlip}
                    />
                </div>

                {/* Floating Buttons */}
                {showFloatingButtons && (
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
                )}

                {/* Flipbook */}
                {dimensions.width > 0 && dimensions.height > 0 && (
                    <HTMLFlipBook
                        swipeDistance={4}
                        ref={book}
                        width={dimensions.width}
                        height={dimensions.height}
                        size="stretch"
                        minWidth={dimensions.width}
                        maxWidth={dimensions.width}
                        minHeight={dimensions.height}
                        maxHeight={dimensions.height}
                        maxShadowOpacity={0.5}
                        showCover={false}
                        mobileScrollSupport={true}
                        useMouseEvents={true}
                        onFlip={(e) => setCurrentSpread(Math.floor(e.data / (isMobile ? 1 : 2)))}
                        flippingTime={500}
                        showPageCorners={true}
                        drawShadow={true}
                    >
                        {spreads.flatMap((spread) => [
                            <Page key={`${spread.spreadNumber}-left`} position="left">
                                {spread.leftContent}
                            </Page>,
                            !isMobile && spread.rightContent && (
                                <Page key={`${spread.spreadNumber}-right`} position="right">
                                    {spread.rightContent}
                                </Page>
                            )
                        ].filter(Boolean))}
                    </HTMLFlipBook>
                )}

                <EnhancedFoodModal
                    showFoodModal={showFoodModal}
                    handleCloseModal={handleCloseModal}
                    foodImg={foodImg}
                    detectedText={detectedText}
                    rating={rating}
                    price={price}
                    sizes={sizes}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    addToCartHandler={addToCartHandler}
                />
            </div>
        </div>
    );
};

export default BookContainer;