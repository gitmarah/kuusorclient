import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteInternshipMutation, useGetInternshipQuery } from '../app/api/internship';
import { skipToken } from '@reduxjs/toolkit/query';
import Header from '../components/Header';
import { useAppSelector } from '../app/hooks';
import { CalendarClock, CircleCheck, MoreHorizontal, RefreshCcw, X } from 'lucide-react';
import { format } from 'date-fns';
import BackBtn from '../components/BackBtn';
import Loader from '../components/Loader';
import type { ToastProps } from '../utils/types';
import Toast from '../components/Toast';
import { useInternshipApplicationMutation } from '../app/api/application';


const InternshipPage: React.FC = () => {

    const params = useParams();
    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user);
    const { applications, isLoadingApplications } = useAppSelector(state => state.applications);
    const { data: internship, isLoading: fetchingInternship, error } = useGetInternshipQuery(params.id ?? skipToken);
    const [apply, { isLoading: applying }] = useInternshipApplicationMutation();
    const [deleteInternship, { isLoading: deleting }] = useDeleteInternshipMutation();
    const isOwner = internship?.companyId === user?.companyId;
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [applied, setApplied] = useState<boolean>(false);
    const requirements = internship?.requirements.split("\n");
    const responsibilities = internship?.responsibilities.split("\n");
    const benefits = internship?.benefits?.split("\n");
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });
    useEffect(() => {
        if(applications) setApplied(applications?.some(application => application.internshipId === internship?.id))
    }, [applications, internship?.id]);

    const handleApplication = async () => {
        if(!user?.studentId || !internship?.id){
            setToastProps({ message: "Student and Internship ID are required!", timeout: 5000, isError: true });
            return;
        }
        try{
            const res = await apply({ studentId: user?.studentId, internshipId: internship?.id });
            if(res.error && typeof res.error === "object" && "data" in res.error){
                const e = res.error as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            } else {
                setApplied(true);
            }
        } catch(err){
            console.log(err)
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }            
        } }

    const handleDelete = async () => {
        if(!internship?.id){
            setToastProps({ message: "Student and Internship ID are required!", timeout: 5000, isError: true });
            return;
        }
        try{
            const res = await deleteInternship(internship?.id);
            if(res.error && typeof res.error === "object" && "data" in res.error){
                const e = res.error as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            } else {
                navigate(-1);
            }
        } catch(err){
            console.log(err)
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }            
        } }

    if(!fetchingInternship && !internship) return (
        <div className='w-full fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center'>
            <h2 className='font-original font-bold text-center text-pri px-4 mb-1 text-md'>{(error as { data: { message: string } })?.data?.message ? (error as { data: { message: string } })?.data?.message : "Unable to fetch Intership!"}</h2>
            <img src="/notgood.png" className='w-40' />
            <button onClick={() => location.href = `${location.origin}${location.pathname.slice(0,)}`} className='bg-pri px-2.5 py-1 text-white rounded-md mt-1 flex items-center gap-1 active:scale-95 transition-transform'><RefreshCcw size={15} /> Refresh</button>
        </div>);

    return (
        <>
            <Header />
            <Toast toastProps={toastProps} setToastProps={setToastProps}/>
            {(fetchingInternship || isLoadingApplications) ? <div className='flex justify-center items-center pt-20'><Loader color='pri' bgcolor='transparent' /></div> : <main className='pt-16 pb-18 px-4 text-bblack md:pb-5'>
                <h2 className='font-original text-pri text-center px-4 mb-2'>Internship Description</h2>
                <div className='flex flex-col p-4 border border-pri/15 rounded-[15px] shadow-xs md:max-w-3/4 md:mx-auto lg:max-w-1/2'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-between relative'>
                            <div className='flex justify-center text-pri gap-1 bg-pri/15 text-[0.7rem] items-center px-1 py-0.5 rounded-full'>
                                <CircleCheck size={13} strokeWidth={3} />
                                <p className='font-semibold'>Verified Company</p>
                            </div> 
                            {isOwner && <div onClick={() => setShowOptions(prev => !prev)} className='text-pri hover:text-pri/90 cursor-pointer active:scale-80 transition-all'>
                                {showOptions ? <X /> : <MoreHorizontal />}    
                            </div>  }
                            {showOptions && <div className='bg-white absolute -right-0.5 top-6 flex flex-col items-center px-0.5 py-1.5 w-25 shadow-lg rounded-lg border border-gray-100 text-sm'>
                                {(!internship?.shortlisted || new Date(internship?.deadline) < new Date()) && <button onClick={() => navigate(`/editinternship/${internship?.id}`)} className='text-left p-2 rounded-lg w-[90%] hover:bg-gray-100 transition-all cursor-pointer active:scale-95'>Edit</button>}
                                <button onClick={handleDelete} disabled={deleting} className='text-rred text-left disabled:text-rred/70 p-2 rounded-lg w-[90%] hover:bg-gray-100 transition-all cursor-pointer active:scale-95'>{deleting ? "Deleting..." : "Delete"}</button>
                            </div>}                         
                        </div>

                        <div className='flex items-center justify-between border-b border-gray-300 pb-3'>
                            <div className='flex items-center gap-2 text-[0.8rem]'>
                                <img className='w-13 rounded-md' src={internship?.profileUrl ?? "/profile.jpg"} />
                                <div>
                                    <p className='font-bold text-sm'>{internship?.companyname}</p>
                                    <p>{internship?.address}</p>
                                </div>
                            </div>
                            {isOwner && <button onClick={() => navigate(`/applicants/${internship?.id}`)} className='text-[0.7rem] bg-pri px-2.5 py-1.5 text-white rounded-lg font-bold cursor-pointer active:scale-95 transition-all'>APPLICANTS</button>}
                            {!isOwner && <button disabled={applied} onClick={handleApplication} className='text-[0.7rem] bg-pri px-2.5 py-1.5 text-white rounded-md font-bold cursor-pointer disabled:bg-gray-400'>{applying ? <Loader color='white' bgcolor='transparent' /> : applied ? "APPLIED" : "APPLY"}</button>}
                        </div>
                        <div>
                            <h2 className='text-sm font-medium text-black'>{internship?.title}</h2>
                            <div>
                                <p className='text-sm text-bblack/90'>
                                {/* <span className='font-bold'>Description: </span> */}
                                {internship?.description}</p>
                            </div>
                            {requirements && <div className='flex-col flex gap-0.5'>
                                <h3 className='text-sm font-medium text-black mt-2'>Requirements</h3>
                                {requirements.map((requirement: string) => <div key={requirement.slice(0,10)} className='text-sm text-bblack/90 flex'>
                                    <div className='w-1 aspect-square bg-pri'></div> 
                                    <p className='bg-pri/15 px-1 w-full'>{requirement}</p>
                                    {/* <div className='w-0.5 aspect-square bg-pri'></div> */}
                                </div>)}
                            </div>}
                            {responsibilities && <div className='flex-col flex gap-0.5'>
                                <h3 className='text-sm font-medium text-black mt-2'>Responsibilities</h3>
                                {responsibilities.map((responsibility: string) => <div key={responsibility.slice(0,10)} className='text-sm text-bblack/90 flex'>
                                    <div className='w-1 aspect-square bg-pri'></div> 
                                    <p className='bg-pri/15 px-1 w-full'>{responsibility}</p>
                                    {/* <div className='w-0.5 aspect-square bg-pri'></div> */}
                                </div>)}
                            </div>}
                            {benefits && <div className='flex-col flex gap-0.5'>
                                <h3 className='text-sm font-medium text-black mt-2'>What You'll Learn</h3>
                                {benefits.map((benefit: string) => <div key={benefit.slice(0,10)} className='text-sm text-bblack/90 flex'>
                                    <div className='w-1 aspect-square bg-pri'></div> 
                                    <p className='bg-pri/15 px-1 w-full'>{benefit}</p>
                                    {/* <div className='w-0.5 aspect-square bg-pri'></div> */}
                                </div>)}
                            </div>}
                            <div>
                                <h3 className='text-sm font-medium text-black mt-2'>Deadline</h3>
                                <p className='text-[0.8rem]'>{format((internship?.deadline as unknown as Date), "PPP")}</p>                                
                            </div>
                            <div className='flex gap-1 items-center mt-2'>
                                <CalendarClock size={17} color="#10367D" />
                                <p className='text-[0.8rem] text-bblack'>{internship?.duration} • {internship?.type}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>}
            <BackBtn />
        </>
    );
}

export default InternshipPage;