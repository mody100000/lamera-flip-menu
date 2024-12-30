import React from 'react';

const Page = React.forwardRef(({ position, children }, ref) => {
    return (
        <div ref={ref} className="relative w-full h-full bg-white">
            <div className="relative w-full h-full">{children}</div>

            {/* Left Side Shadows */}
            {position === 'left' && (
                <div className="absolute left-0 top-0 h-full pointer-events-none z-20">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={`left-shadow-${i}`}
                            className="absolute inset-y-0 left-0"
                            style={{
                                width: `${20 - i * 4}px`,
                                background: `linear-gradient(to right, rgba(0,0,0,${0.15 - i * 0.03}), transparent)`,
                                transform: `translateX(${i * 2}px)`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Right Side Shadows */}
            {position === 'right' && (
                <div className="absolute right-0 top-0 h-full pointer-events-none z-20">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={`right-shadow-${i}`}
                            className="absolute inset-y-0 right-0"
                            style={{
                                width: `${20 - i * 4}px`,
                                background: `linear-gradient(to left, rgba(0,0,0,${0.15 - i * 0.03}), transparent)`,
                                transform: `translateX(-${i * 2}px)`,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default Page;