import React, { useEffect, useState, type FormEvent } from 'react';
import Header from '../components/Header';
import BackBtn from '../components/BackBtn';
import { useGetApplicationsByInternshipQuery, useRemoveApplicationMutation, useShortlistApplicantsMutation } from '../app/api/application';
import { useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';
import Loader from '../components/Loader';
import ApplicantExcerpt from '../components/ApplicantExcerpt';
import type { ToastProps, User } from '../utils/types';
import { ChevronLeft } from 'lucide-react';
import Toast from '../components/Toast';
import type { ShortlistValidationError } from '../utils/validationRules';
import { useGetInternshipQuery } from '../app/api/internship';

const Applicants: React.FC = () => {

    const params = useParams();
    const { data: applications, isLoading: fetchingApplications } = useGetApplicationsByInternshipQuery(params?.id ?? skipToken);
    const { data: internship, isLoading: fetchingInternship } = useGetInternshipQuery(params.id ?? skipToken);
    const [removeApplicants, { isLoading: removingApplicants }] = useRemoveApplicationMutation();
    const [shortlistApplicants, { isLoading: shortlistingApplicants }] = useShortlistApplicantsMutation();
    const [students, setStudents] = useState<User[]>([]);
    const [type, setType] = useState<string>("in-person");
    const [datetime, setDatetime] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [showRemoveOptions, setShowRemoveOptions] = useState<boolean>(false);
    const [showShortlistOptions, setShowShortlistOptions] = useState<boolean>(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });
    const [validationErrors, setValidationErrors] = useState<ShortlistValidationError>({ datetime: null, location: null });

    useEffect(() => {
        if(applications) setStudents(applications?.map(application => ({...application.student, selected: false})));
    }, [applications]);

    useEffect(() => {
        if(students) {
            const selectedStudents = students.filter(student => student.selected);
            setSelected(selectedStudents.map(student => student.id));
        }
    }, [students]);

    const numberToWords = (num: number): string => {
        if (num < 1 || num > 1_000_000) throw new Error("Number must be between 1 and 1,000,000");
        if (num === 1_000_000) return "One Million";
        const ones = [
            "", "One", "Two", "Three", "Four", "Five",
            "Six", "Seven", "Eight", "Nine" ];

        const teens = [
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
            "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen" ];

        const tens = [
            "", "", "Twenty", "Thirty", "Forty",
            "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" ];

        function convertBelowThousand(n: number): string {
            let result = "";
            if (n >= 100) {
                result += ones[Math.floor(n / 100)] + " Hundred ";
                n %= 100; }

            if (n >= 20) {
                result += tens[Math.floor(n / 10)] + " ";
                n %= 10;
            } else if (n >= 10) {
                result += teens[n - 10] + " ";
                n = 0; }

            if (n > 0) result += ones[n] + " ";
            return result.trim();
        }

        let words = "";
        if (num >= 1000) {
            words += convertBelowThousand(Math.floor(num / 1000)) + " Thousand ";
            num %= 1000; }

        if (num > 0) words += convertBelowThousand(num);
        return words.trim();
    }

    const handleRemoval = async () => {
        const body = { selected: JSON.stringify(selected) };
        if(!params.id) {
            setToastProps({ message: "Intership Id is required!", timeout: 5000, isError: true });
            return;
        }
        try{
            const res = await removeApplicants({ body, id: params.id });
            if(res.error && typeof res.error === "object" && "data" in res.error){
                const e = res.error as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        } catch(err){
            console.log(err)
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }            
        } finally{
            setShowRemoveOptions(false);
        }       
    }

    const handleShortlist = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = { selected: JSON.stringify(selected), location, datetime, type };
        console.log(body);
        if(!datetime) {
            setValidationErrors(prev => ({ ...prev, datetime: "Interview Date & Time entry is required!" })); return; }
        const now = new Date();
        const deadlineDate: Date = new Date(datetime);
        if(deadlineDate < now) {
            setValidationErrors(prev => ({ ...prev, datetime: "Deadline must be a date after now!" })); return; }
        if(type === "in-person" && !location) {
            setValidationErrors(prev => ({ ...prev, location: "Interview Venue is required!" })); return; }
        if(type === "in-person" && location.length < 5) {
            setValidationErrors(prev => ({ ...prev, location: "Interview Venue is too short (Minimum 5 characters)!" })); return; }
        if(type === "in-person" && location.length > 100) {
            setValidationErrors(prev => ({ ...prev, location: "Interview Venue is too short (Maximum 100 characters)!" })); return; }
        if(!params.id) {
            setToastProps({ message: "Intership Id is required!", timeout: 5000, isError: true });
            return;
        }
        try{
            const res = await shortlistApplicants({ body, id: params.id });
            if(res.error && typeof res.error === "object" && "data" in res.error){
                const e = res.error as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        } catch(err){
            console.log(err)
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }            
        } finally{
            setShowShortlistOptions(false);
        }       
    }

    console.log(internship);


    return (
        <>
            <Header />
                <Toast toastProps={toastProps} setToastProps={setToastProps}/>
                <main className='pt-16 px-4 md:px-0 md:max-w-3/4 md:mx-auto'>
                    {(!fetchingApplications && !fetchingInternship && !internship?.shortlisted) && <div className='flex gap-2 mb-2 text-sm'>
                        <button onClick={() => setShowShortlistOptions(true)} disabled={!selected?.length} className='bg-pri text-white flex-1 p-2 rounded-[15px] disabled:bg-gray-400 cursor-pointer active:scale-95 transition-all'>Shortlist</button>
                        <button onClick={() => {setShowRemoveOptions(true); console.log(selected)}} disabled={!selected?.length} className='bg-rred text-white flex-1 p-2 rounded-[15px] disabled:bg-gray-400 cursor-pointer active:scale-95 transition-all'>Remove</button>
                    </div>}
                    {internship?.shortlisted && <h2 className='text-center font-original text-sm mb-2 text-pri'>Shortlisted Applicants</h2>}
                    {
                        showRemoveOptions && <>
                            <div  onClick={() => setShowRemoveOptions(false)} className='fixed transition-all top-0 bottom-0 left-0 right-0 bg-black/90'></div>
                            <div className='bg-white transition-all p-5 rounded-[15px] fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-[320px] flex flex-col items-center gap-2'>
                                <p className='text-center'>You are about to remove <br/><span className='font-bold'>{numberToWords(selected.length)} ({selected.length}) Applicants</span> from this application!</p>
                                <div className='flex gap-2'>
                                    <button onClick={() => setShowRemoveOptions(false)} disabled={!selected?.length} className='bg-pri text-white flex-1 py-2 cursor-pointer rounded-[10px] disabled:bg-gray-400 px-4 text-sm w-20'>Cancel</button>
                                    <button onClick={handleRemoval} disabled={!selected?.length} className='bg-rred text-white flex-1 py-2 cursor-pointer rounded-[10px] disabled:bg-gray-400 px-4 text-sm flex justify-center w-20 items-center'>{removingApplicants ? <Loader color='white' bgcolor='transparent' /> : "Okay"}</button>
                                </div>
                            </div>
                        </>
                    }
                    {
                        showShortlistOptions && <>
                            <div className='fixed transition-all top-0 bottom-0 left-0 right-0 z-40 bg-white flex justify-center items-center'>
                                <form onSubmit={handleShortlist} className='w-full p-5 flex flex-col gap-2 max-w-87.5'>
                                    <h2 className='text-center font-original text-pri'>Send Interview Details<br/>to Shortlisted Candidates</h2>
                                    <div className='flex flex-col gap-0.5'>
                                        <label htmlFor="datetime" className='text-bblack text-[0.8rem]'>Interview Date & Time<span className='text-rred'>*</span></label>
                                        <input type="datetime-local" autoFocus={true} className='input-field' name="datetime" id="datetime" value={datetime} onChange={(e) => {setDatetime(e.target.value); setValidationErrors(prev => ({ ...prev, datetime: null }))}} />
                                        {validationErrors.datetime && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.datetime}</p>}
                                    <div className='w-full'> 
                                    </div>  
                                        <label htmlFor='type' className='text-[0.8rem] text-bblack text-center'>Interview Type<span className='text-rred'>*</span></label> 
                                        <div className="flex text-sm rounded-[15px] border border-[#bbbbbb] w-full font-original">
                                            <div onClick={() => setType("in-person")} className={`flex-1 py-2.5 text-bblack ${type === "in-person" && "bg-pri text-white"} text-center cursor-pointer rounded-[15px] transition-all`}>In-Person</div>
                                            <div onClick={() => setType("online")} className={`flex-1 py-2.5 text-bblack ${type === "online" && "bg-pri text-white"} text-center cursor-pointer rounded-[15px] transition-all`}>Online</div>
                                        </div> 

                                    </div>   
                                    {type === "in-person" && <div className='flex flex-col gap-0.5'>
                                        <label htmlFor="location" className='text-bblack text-[0.8rem]'>Interview Venue<span className='text-rred'>*</span></label>
                                        <input type="text" placeholder="0001 First Avenue, The Village. MC, SL." autoFocus={true} className='input-field' name="location" id="location" value={location} onChange={(e) => {setLocation(e.target.value); setValidationErrors(prev => ({ ...prev, location: null }))}} />
                                    </div>}
                                    {validationErrors.location && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.location}</p>}
                                    <button disabled={!selected?.length} className='bg-pri text-white flex-1 py-3 rounded-[15px] disabled:bg-gray-400 px-4 w-full text-sm cursor-pointer flex justify-center items-center active:scale-95 transition-all'>{shortlistingApplicants ? <Loader color='white' bgcolor='transparent' /> : "Shortlist"}</button>
                                </form>
                                <div onClick={() => setShowShortlistOptions(false)} className='w-10 z-30 aspect-square flex rounded-full justify-center items-center bg-[#74B4DA] left-4 bottom-4 fixed'>
                                    <div className='w-8 active:scale-110 transition-all flex justify-center items-center text-white aspect-square bg-pri rounded-full cursor-pointer'>
                                        <ChevronLeft strokeWidth={3} className='-ml-1' />
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {(fetchingApplications || fetchingInternship) ? <div className='flex justify-center items-center pt-3'><Loader color='pri' bgcolor='transparent' /></div> : <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-2 text-bblack'>
                        {students?.map(student => <ApplicantExcerpt key={student.id} student={student} setStudents={setStudents} students={students} shortlisted={internship?.shortlisted} />)}
                    </div>}
                </main>
            <BackBtn />
        </>
    )
}

export default Applicants;