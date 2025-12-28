import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackBtn: React.FC = () => {

    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(-1)} className='cursor-pointer w-10 z-30 aspect-square flex rounded-full justify-center items-center bg-[#74B4DA] left-4 bottom-4 fixed'>
            <div className='w-8 active:scale-110 transition-all flex justify-center items-center text-white aspect-square bg-pri rounded-full'>
                <ChevronLeft strokeWidth={3} className='-ml-1' />
            </div>
        </div>
    )
}

export default BackBtn;