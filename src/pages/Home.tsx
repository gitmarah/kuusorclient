import React from 'react';
import Header from '../components/Header';
import { useGetInternshipsByCompanyQuery, useGetInternshipsQuery } from '../app/api/internship';
import { useAppSelector } from '../app/hooks';
import { skipToken } from '@reduxjs/toolkit/query';
import InternshipExcerpt from '../components/InternshipExcerpt';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {

    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user)
    const { data: companyInternships, isLoading: fetchingCompanyInternships } = useGetInternshipsByCompanyQuery((user?.role !== "COMPANY" || !user.companyId) ? skipToken : user?.companyId);
    const { data: fetchedInternships, isLoading: fetchingInternships } = useGetInternshipsQuery(user?.role !== "COMPANY" ? null : skipToken);
    const internships = fetchedInternships?.filter(internship => !internship.shortlisted && new Date() < new Date(internship.deadline));

    return (
        <>
            <Header />
            <div className='md:max-w-3/4 md:mx-auto pt-15 px-5 md:px-0'>
                <button onClick={() => navigate("/students")} className='text-sm w-full text-white py-1.5 rounded-[15px] hover:opacity-90 cursor-pointer active:scale-95 transition-all bg-[#74B4DA] mb-2'>Browse Students</button>                
            </div>

            <main className='px-5 md:px-0 md:max-w-3/4 md:mx-auto'>
                {fetchingCompanyInternships ? <div className='flex justify-center items-center pt-3'><Loader color='pri' bgcolor='transparent' /></div> : <div><div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-2 pb-3 text-bblack ${user?.role !== "COMPANY" && "hidden"}`}>
                    {companyInternships?.map(internship => <InternshipExcerpt key={internship?.id} internship={internship} />)}
                    {companyInternships?.length === 0 && <div className='w-full flex flex-col justify-center items-center'>
                        <h2 className='font-original font-bold text-center text-pri px-4 mb-1 text-md'>No Internship Posting!</h2>
                        <img src="/notgood.png" className='w-40' />
                    </div>}
                </div></div>}
                {fetchingInternships ? <div className='flex justify-center items-center pt-3'><Loader color='pri' bgcolor='transparent' /></div> : (user?.role !== "COMPANY") && <div><div className='grid md:grid-cols-2 lg:grid-cols-3 gap-2 text-bblack pb-3'>
                    {internships?.map(internship => <InternshipExcerpt key={internship?.id} internship={internship} />)}</div>
                </div>}
                {internships?.length === 0 && <div className='w-full flex flex-col justify-center items-center'>
                    <h2 className='font-original font-bold text-center text-pri px-4 mb-1 text-md'>No Internship Posting!</h2>
                    <img src="/notgood.png" className='w-40' />
                </div>}
            </main>
        </>
    )
}

export default Home;