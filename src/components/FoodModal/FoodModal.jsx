import React from 'react';
import { X, Minus, Plus, Star } from 'lucide-react';

const EnhancedFoodModal = ({
    showFoodModal,
    handleCloseModal,
    foodImg,
    detectedText,
    rating,
    price,
    sizes,
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    addToCartHandler
}) => {
    // Render stars with hover effect
    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                    }`}
            />
        ));
    };

    if (!showFoodModal) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-4xl overflow-y-auto sm:overflow-y-hidden max-h-[90vh] overflow-hidden animate-in fade-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between bg-gradient-to-l from-gray-50 to-gray-100 px-6 py-2">
                    <button
                        onClick={handleCloseModal}
                        className="rounded-full p-2 hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 flex flex-col items-center gap-y-5">
                        <div className="relative group">
                            <img
                                src={foodImg}
                                alt="وجبة طعام"
                                className="w-full h-80 object-cover rounded-full sm:rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-full sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        {/* Quantity */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center bg-black text-white rounded-full border border-gray-200">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:bg-gray-800 transition-colors rounded-full"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-6 font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-3 hover:bg-gray-800 transition-colors rounded-full"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                    {/* Details Section */}
                    <div className="w-full md:w-1/2 text-right space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800">{detectedText}</h2>
                        <p className="text-gray-600 leading-relaxed">
                            برجر شهي مصنوع من لحم بقري فاخر، مع خس طازج،
                            طماطم، وصلصتنا السرية المميزة. يقدم مع البطاطس المقلية المقرمشة.
                        </p>
                        {/* Price */}
                        <div className="text-3xl font-bold text-green-600">
                            {price.toFixed(2)} EGP
                        </div>
                        {/* Rating */}
                        <div className="flex justify-end items-center gap-2">
                            <span className="text-gray-600 text-sm">(١٢٤ تقييم)</span>
                            <div className="flex gap-1">
                                {renderStars(rating)}
                            </div>
                        </div>



                        {/* Size Selection */}
                        <div className="space-y-3">
                            <label className="block font-semibold text-gray-800 text-lg">الحجم</label>
                            <div className="flex gap-3 justify-end">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`px-6 py-2 rounded-lg border-2 transition-all duration-200 ${selectedSize === size
                                            ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>


                        {/* Add to Cart Button */}
                        <button
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-medium text-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
                            onClick={addToCartHandler}
                        >
                            <span>إضافة إلى الطلب</span>
                            <span className="text-green-200">-</span>
                            <span>{(price * quantity).toFixed(2)} EGP</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedFoodModal;