import React from 'react';
import Header from './Header';

const ProfileSkeleton: React.FC = () => {
    return (
        <>
            <div className='hidden md:flex'><Header /></div>
            <div className="fixed top-0 bottom-0 md:bottom-auto left-0 right-0 flex flex-col justify-end md:max-w-3/4 md:mx-auto md:border md:border-gray-200 md:shadow-sm md:m-5 md:rounded-[25px] md:overflow-hidden md:mt-17 lg:max-w-1/2 animate-pulse">
            <div className='w-full p-7 '>
                <div className='flex items-center gap-2 w-full'>
                    {/* Profile picture */}
                    <div className="w-20 aspect-square bg-gray-300 rounded-full mb-4"></div>
                    <div className='w-full'>
                        {/* Name */}
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>

                        {/* Location / Industry */}
                        <div className="h-3 bg-gray-300 rounded w-3/5 mb-1"></div>                

                        {/* Location / Industry */}
                        <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>                
                    </div>
                </div>
                {/* Buttons */}
                <div className="flex space-x-2">
                    <div className="h-8 w-20 bg-gray-300 rounded"></div>
                    <div className="h-8 w-20 bg-gray-300 rounded"></div>
                </div>            
            </div>
            <div className='flex-1 relative bg-white rounded-t-[50px] md:rounded-none px-7 py-9'>
                <div className='w-30 h-1.5 bg-gray-300 rounded-full absolute top-1 left-1/2 -translate-x-1/2'></div>
                
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>

            
                <div className="mt-7 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>

            
                <div className="mt-7 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
            </div>
        </>
    );
};

export default ProfileSkeleton;
