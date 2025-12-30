import React, { type SetStateAction } from 'react';
import type { User } from '../utils/types';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
    student: User;
    students: User[];
    setStudents: React.Dispatch<SetStateAction<User[]>>;
    shortlisted: boolean | undefined;
}

const ApplicantExcerpt: React.FC<Props> = ({ student, setStudents, students, shortlisted }) => {

    const navigate = useNavigate();
    console.log(student)
    const handleSelection = () => {
        const updatedStudents = [...students.map(s => {
            if(s.id === student.id) return ({ ...s, selected: !s.selected });
            return s; })]
        setStudents(updatedStudents); }

    return (
        <div className='shadow-xs border border-gray-200 rounded-[15px] flex justify-between items-center hover:bg-gray-50 active:scale-97 transition-all bg-white'>
            <div onClick={() => navigate(`/profile/${student.userId}`)} className='flex items-center gap-2 flex-1 p-3 cursor-pointer'>
                <img src={student.profileUrl} className='w-17 aspect-square rounded-full object-cover object-top' />
                <div className='flex flex-col text-[0.85rem]'>
                    <h2 className='font-extrabold text-sm'>{student.firstname} {student.lastname}</h2>
                    <p>{student.address}</p>
                    <p>{student.course}</p>
                </div>
            </div>
            {!shortlisted && <div className='flex flex-col items-center gap-2 mr-3'>
                {student?.resumeUrl && <a href={student.resumeUrl} className='text-[0.8rem] px-2 py-1 rounded-[10px] bg-pri text-white'>View CV</a>}
                <button onClick={handleSelection} className={`border border-gray-300 rounded-[10px] w-10 aspect-square cursor-pointer text-white transition-all flex justify-center items-center ${student.selected && "bg-pri"}`}>{student.selected ? <Check /> :""}</button>
            </div>}
        </div>
    );
}

export default ApplicantExcerpt;