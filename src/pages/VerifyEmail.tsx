import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVerifyEmailQuery } from '../app/api/auth';
import Loader from '../components/Loader';
import { skipToken } from '@reduxjs/toolkit/query';

const VerifyEmail: React.FC = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { data } = useVerifyEmailQuery(token ?? skipToken);
    useEffect(() => {
        if(data && data.message){
            navigate("/signin?type=emailverification")
        }
    }, [data, navigate])

    return (
        <main className='fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center'>
            <Loader color='pri' bgcolor='gray-300' />
            <p>Verifying your email...</p>
        </main>
    )
}

export default VerifyEmail