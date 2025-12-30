import React from 'react';
import Header from '../components/Header';
import BackBtn from '../components/BackBtn';
import { useAppSelector } from '../app/hooks';
import Loader from '../components/Loader';
import InternshipExcerpt from '../components/InternshipExcerpt';
import { useGetApplicationsByStudentQuery } from '../app/api/application';
import { skipToken } from '@reduxjs/toolkit/query';

const Applications: React.FC = () => {

    const user = useAppSelector(state => state.auth.user);
    const { data: applications, isLoading: isLoadingApplications } = useGetApplicationsByStudentQuery(user?.studentId ?? skipToken);
    const internships = applications?.map(application => application?.internship);
    
    return (
        <>
            <Header />
                <main className='pt-16 px-4 pb-4 md:px-0 md:max-w-3/4 md:mx-auto'>
                    {(!isLoadingApplications && applications) && <h2 className='font-original text-center text-pri px-4 mb-2 text-sm'>Pending Applications</h2>}
                    {isLoadingApplications ? <div className='flex justify-center items-center pt-3'><Loader color='pri' bgcolor='transparent' /></div> : <div className='flex flex-col gap-2 text-bblack'>
                        {internships?.map(internship => <InternshipExcerpt key={internship.id} internship={internship} />)}
                    </div>}

                </main>
                {(!isLoadingApplications && !applications) && <div className='w-full fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center'>
                    <h2 className='font-original font-bold text-center text-pri px-4 mb-1 text-md'>No Pending Application!</h2>
                    <img src="/notgood.png" className='w-40' />
                </div>}
            <BackBtn />
        </>
    )
}

export default Applications;