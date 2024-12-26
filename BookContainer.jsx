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
                        useMouseEvents={false}
                        onFlip={(e) => setCurrentSpread(Math.floor(e.data / (isMobile ? 1 : 2)))}
                        flippingTime={500}
                        showPageCorners={true}
                        drawShadow={true}
                    // swipeDistance={200}
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

                {/* //textModal  */}
                {showFoodModal && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-3xl max-h-[90%] overflow-y-auto flex flex-col">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between bg-gray-100 p-6 rounded-t-lg">
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-600 hover:text-gray-800 transition-colors text-4xl"
                                >
                                    ×
                                </button>
                                <div className="text-2xl font-thin">التفاصيل</div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 flex flex-col md:flex-row gap-8">
                                {/* Food Image */}
                                <div className="w-full md:w-1/2">
                                    <img
                                        src={foodImg}
                                        alt="وجبة طعام"
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                </div>

                                {/* Food Details */}
                                <div className="w-full md:w-1/2 text-right">
                                    <h2 className="text-3xl font-bold mb-4">{detectedText}</h2>

                                    {/* Rating */}
                                    <div className="mb-4 flex justify-end items-center">
                                        <span className="ml-2 text-gray-600">(١٢٤ تقييم)</span>
                                        {renderStars(rating)}
                                    </div>

                                    {/* Price */}
                                    <div className="text-2xl font-semibold text-green-600 mb-4">
                                        {price.toFixed(2)} EGP
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-700 mb-4">
                                        برجر شهي مصنوع من لحم بقري فاخر، مع خس طازج،
                                        طماطم، وصلصتنا السرية المميزة. يقدم مع البطاطس المقلية المقرمشة.
                                    </p>

                                    {/* Size Selection */}
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-xl">الحجم</label>
                                        <div className="flex gap-2 justify-end">
                                            {sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    className={`px-4 py-2 rounded-lg border ${selectedSize === size
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    onClick={() => setSelectedSize(size)}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center border rounded-lg ml-4">
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="px-3 py-1 hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                            <span className="px-4">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-3 py-1 hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                        </div>
                                        <label className="font-medium text-xl">الكمية</label>
                                    </div>

                                    {/* Order Button */}
                                    <button
                                        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
                                        onClick={addToCartHandler}
                                    >
                                        EGP إضافة إلى الطلب - {(price * quantity).toFixed(2)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookContainer;