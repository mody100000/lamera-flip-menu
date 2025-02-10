import React from 'react';
import coverImage from "@assets/cover.jpg"
const CoverPage = () => (
    <div className="flex items-center justify-center bg-no-repeat w-full h-full bg-cover bg-center text-white text-4xl font-bold"
    >
        <img src={coverImage} alt="" className='w-full h-full' />
    </div>
);


export default CoverPage;