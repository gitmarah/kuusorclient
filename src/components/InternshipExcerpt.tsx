import React from 'react';
import type { Internship } from '../utils/types';
import { CalendarClock, CircleCheck, ClipboardClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Props {
    internship: Internship;
}

const InternshipExcerpt: React.FC<Props> = ({ internship }) => {

    const navigate = useNavigate();

    return (
        <div className='flex flex-col p-4 border border-pri/15 rounded-[15px] shadow-xs'>
            <div className='flex flex-col gap-2'>
                <div className='flex justify-between relative'>
                    <div className='flex justify-center h-5 text-pri gap-1 bg-pri/15 text-[0.7rem] items-center px-1 py-0.5 rounded-full'>
                        <CircleCheck size={13} strokeWidth={3} />
                        <p className='font-semibold'>Verified Company</p>
                    </div>                        
                    {internship.shortlisted && <div className='flex justify-center h-5 text-pri gap-1 bg-pri/15 text-[0.7rem] items-center px-2 py-0.5 rounded-full'>
                        {/* <CircleCheck size={13} strokeWidth={3} /> */}
                        <p className='font-semibold'>Shortlisted</p>
                    </div>}                        
                </div>

                <div className='flex items-center justify-between border-b border-gray-300 pb-3'>
                    <div className='flex items-center gap-2 text-[0.8rem]'>
                        <img className='w-11 rounded-md' src={internship?.profileUrl ?? "/profile.jpg"} />
                        <div>
                            <p className='font-bold text-sm'>{internship?.companyname}</p>
                            <p className='text-[0.75rem] -mt-0.5 text-bblack/70'>{internship?.address}</p>
                        </div>
                    </div>
                    <button onClick={() => navigate(`/internship/${internship.id}`)} className='text-[0.7rem] bg-pri px-2.5 py-1.5 text-white rounded-[10px] font-bold active:scale-95 transition-all min-w-18 h-7 cursor-pointer'>VIEW</button>
                </div>
                <div>
                    <h2 className='text-sm font-medium text-black'>{internship?.title}</h2>
                    <div>
                        <p className='text-sm text-bblack/70'>
                        {internship?.description.slice(0, 140)}...</p>
                    </div>
                    <div className='flex justify-between'>
                        <div className='flex gap-1 items-center mt-2'>
                            <CalendarClock size={17} color="#10367D" />
                            <p className='text-[0.8rem] text-bblack'>{internship?.duration} • {internship?.type}</p>
                        </div>
                        <div className='flex gap-1 items-center mt-2'>
                            <ClipboardClock size={17} color="#10367D" />
                            <p className='text-[0.8rem] text-bblack'>{format(internship?.deadline, "PPP")}</p>
                        </div>                        
                    </div>

                </div>
            </div>
        </div>
    )
}

export default InternshipExcerpt;