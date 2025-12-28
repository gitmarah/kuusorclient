import React from 'react';
import Header from '../components/Header';
import { useGetStudentsQuery } from '../app/api/user';
import Loader from '../components/Loader';
import StudentExcerpt from '../components/StudentExcerpt';
import BackBtn from '../components/BackBtn';
import { useAppSelector } from '../app/hooks';

const Students: React.FC = () => {

    const user = useAppSelector(state => state.auth.user);
    const { data, isLoading: fetchingStudents } = useGetStudentsQuery(null);
    const students = data?.filter(student => student.id !== user?.id)

    return (
        <>
            <Header />
            <main className='pt-16 p-3 md:px-0 md:max-w-3/4 md:mx-auto'>
                {fetchingStudents ? <div className='flex justify-center items-center pt-3'><Loader color='pri' bgcolor='transparent' /></div> : <div>
                    <div className='grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-2'>
                    {students?.map(student => <StudentExcerpt student={student} />)}
                </div></div>}
            </main>
            <BackBtn />
        </>
    )
}

export default Students;