import React from 'react';

const Page = React.forwardRef(({ content, number }, ref) => (
    <div className="page" ref={ref}>
        <div className="h-full w-full bg-white shadow-md">
            <div className="h-full relative">
                <div className="h-full">{content}</div>
                <div className="absolute bottom-4 right-4 text-gray-400">Page {number}</div>
            </div>
        </div>
    </div>
));

export default Page;