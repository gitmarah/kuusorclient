import React from 'react';
import type { User } from '../utils/types';
import { BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
    student: User;
}

const StudentExcerpt: React.FC<Props> = ({ student }) => {

    const navigate = useNavigate();

    return (
        <div className='flex flex-col p-4 border bg-white border-pri/15 rounded-[15px] shadow-xs'>
            <div className='flex flex-col gap-1'>
                <div className='flex flex-col gap-2 items-center justify-between'>
                    <div className='flex flex-col items-center gap-2 text-[0.8rem]'>
                        <img className='w-24 aspect-square object-top object-cover rounded-full' src={student?.profileUrl ?? "/profile.jpg"} />
                        <div className='flex flex-col items-center'>
                            <div className='flex gap-1'>
                                <p className='font-bold text-sm whitespace-nowrap flex items-center'>{student?.firstname} {student?.lastname}<BadgeCheck size={17} color='#fff' fill='#74B4DA' /></p>
                            </div>
                            <p className='text-center'>{student?.address}</p>
                            <p className='text-gray-400 text-[0.7rem]'>{student?.university}</p>
                        </div>
                    </div>
                    <button onClick={() => navigate(`/profile/${student.id}`)} className='w-full text-[0.7rem] border border-pri px-2.5 py-1.5 text-pri rounded-[15px] font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer'>VIEW</button>
                </div>
            </div>
        </div>
    )
}

export default StudentExcerpt;