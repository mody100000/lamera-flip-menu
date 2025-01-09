const BookShadowStripes = ({ side }) => {
    return (
        <div
            className={`absolute inset-y-0 ${side === "left" ? "left-0" : "right-0"} pointer-events-none`}
        >
            {[...Array(8)].map((_, i) => (
                <div
                    key={`${side}-shadow-${i}`}
                    className="absolute inset-y-0"
                    style={{
                        width: `${40 - i * 5}px`,
                        background: `linear-gradient(
                            to ${side === 'left' ? 'right' : 'left'}, 
                            rgba(0, 0, 0, ${0.2 - i * 0.02}), 
                            rgba(0, 0, 0, ${0.1 - i * 0.01}), 
                            transparent
                        )`,
                        transform: `
                            translateX(${side === 'left' ? -i * 5.5 : i * 1.5}px)
                            rotate(${side === 'left' ? 0.5 : -0.5}deg)
                        `,
                        zIndex: 10 - i,
                        // zindex: 20 + i
                    }}
                />
            ))}
        </div>
    );
};
export default BookShadowStripes