import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Header from '../components/Header';
import type { PostInternshipFormData, ToastProps } from '../utils/types';
import { postInternshipValidationRules, type PostInternshipValidationErrors } from '../utils/validationRules';
import Loader from '../components/Loader';
import { useGetInternshipQuery, useUpdateInternshipMutation } from '../app/api/internship';
import Toast from '../components/Toast';
import { useNavigate, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';
import BackBtn from '../components/BackBtn';

const EditInternship: React.FC = () => {

    const params = useParams();
    const navigate = useNavigate();
    const { data: internship, isLoading: fetchingInternship } = useGetInternshipQuery(params.id ?? skipToken);
    const [updateInternship, { isLoading: updating }] = useUpdateInternshipMutation();

    const [formData, setFormData] = useState<PostInternshipFormData>({ 
        title: "", 
        description: "", 
        type: "Remote", 
        duration: "", 
        deadline: "", 
        companyId: "", 
        responsibilities: "", 
        requirements: "", 
        benefits: "" });
    const [validationErrors, setValidationErrors] = useState<PostInternshipValidationErrors>({ title: null, description: null, type: null, duration: null, deadline: null, responsibilities: null, requirements: null, benefits: null });
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });


    useEffect(() => {
        if(internship){
            const formatForDateTimeLocal = (date: string | Date | null | undefined) => {
                if (!date) return "";
                const d = new Date(date);
                if (isNaN(d.getTime())) return "";
                return d.toISOString().slice(0, 16);
            };
            setFormData({
                title: internship?.title || "", 
                description: internship?.description || "", 
                type: internship?.type || "Remote", 
                duration: internship?.duration || "",
                companyId: internship?.companyId || "", 
                responsibilities: internship?.responsibilities || "", 
                requirements: internship?.requirements || "", 
                benefits: internship?.benefits || "", 
                deadline: formatForDateTimeLocal(internship.deadline)
            })
        }
    }, [internship])


    const handleInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValidationErrors(prev => ({...prev, [name]: null}));
        setFormData(prev => ({ ...prev, [name]: value })); }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = postInternshipValidationRules(formData);
        setValidationErrors(errors)
        if(Object.values(errors).filter(value => value !== null).length > 0) return;
        try{
            if(!internship?.id) {
                setToastProps({ message: "Internship Id is required!", timeout: 5000, isError: true });
                return;
            }
            const response = await updateInternship({body: formData, id: internship.id}).unwrap();
            if(response.id) navigate(`/internship/${response.id}`)
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        } }


    return (
        <>
            <Header />
            {fetchingInternship ? <Loader color='pri' bgcolor='transparent' /> : <main className='pt-15 pb-4 px-4 text-bblack'>
                <h2 className='font-original text-pri text-center px-4'>Edit Internship</h2>
                <Toast toastProps={toastProps} setToastProps={setToastProps}/>
                <form onSubmit={handleSubmit} className='w-full max-w-[320px] mx-auto flex flex-col gap-2'>
                    <div className="w-full">
                        <label htmlFor='title' className='text-[0.8rem] text-bblack'>Role Title<span className='text-rred'>*</span></label>
                        <input type="text" name='title' className='input-field' placeholder='Marketing Intern' value={formData.title} onChange={handleInputChange} />
                        {validationErrors.title && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.title}</p>}
                    </div>                    
                    <div className="w-full relative">
                        <label htmlFor='description' className='text-[0.8rem] text-bblack'>Role Description<span className='text-rred'>*</span></label>
                        <textarea name='description' rows={6} maxLength={440} className='input-field hide-scrollbar' placeholder='Provide a brief overview of the role, including its purpose and what the candidate will be doing.' value={formData.description} onChange={handleInputChange} />
                        {validationErrors.description && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.description}</p>}
                        {formData.description && <p className={`absolute -bottom-2.5 right-0 text-[0.7rem] text-bblack ${formData.description.length === 440 && "text-rred"}`}>{formData.description.length}/440</p>}
                    </div>
                    <div className="w-full relative">
                        <label htmlFor='responsibilities' className='text-[0.8rem] text-bblack'>Responsibilities<span className='text-rred'>*</span></label>
                        <textarea name='responsibilities' rows={6} maxLength={440} className='input-field hide-scrollbar' placeholder='Outline the main tasks and duties the candidate will be responsible for.' value={formData.responsibilities} onChange={handleInputChange} />
                        {validationErrors.responsibilities && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.responsibilities}</p>}
                        {formData.responsibilities && <p className={`absolute -bottom-2.5 right-0 text-[0.7rem] text-bblack ${formData.responsibilities.length === 440 && "text-rred"}`}>{formData.responsibilities.length}/440</p>}
                    </div>
                    <div className="w-full relative">
                        <label htmlFor='requirements' className='text-[0.8rem] text-bblack'>Requirements (Optional)</label>
                        <textarea name='requirements' rows={6} maxLength={440} className='input-field hide-scrollbar' placeholder='List the skills, qualifications, or experience needed to be considered for this role.' value={formData.requirements} onChange={handleInputChange} />
                        {validationErrors.requirements && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.requirements}</p>}
                        {formData.requirements && <p className={`absolute -bottom-2.5 right-0 text-[0.7rem] text-bblack ${formData.requirements.length === 440 && "text-rred"}`}>{formData.requirements.length}/440</p>}
                    </div>
                    <div className="w-full relative">
                        <label htmlFor='benefits' className='text-[0.8rem] text-bblack'>What You'll Learn (Optional but encouraged)</label>
                        <textarea name='benefits' rows={6} maxLength={440} className='input-field hide-scrollbar' placeholder='Describe what the candidate will gain from this role, such as learning opportunities or incentives.' value={formData.benefits} onChange={handleInputChange} />
                        {validationErrors.benefits && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.benefits}</p>}
                        {formData.benefits && <p className={`absolute -bottom-2.5 right-0 text-[0.7rem] text-bblack ${formData.benefits.length === 440 && "text-rred"}`}>{formData.benefits.length}/440</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='duration' className='text-[0.8rem] text-bblack'>Duration<span className='text-rred'>*</span></label>
                        <input type='text' name='duration' className='input-field' placeholder='3 Months' value={formData.duration} onChange={handleInputChange} />
                        {validationErrors.duration && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.duration}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='deadline' className='text-[0.8rem] text-bblack'>Application Deadline<span className='text-rred'>*</span></label>
                        <input type='datetime-local' name='deadline' className='input-field' placeholder='Deadline' value={formData.deadline as unknown as string} onChange={handleInputChange} />
                        {validationErrors.deadline && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.deadline}</p>}
                    </div>
                    <div className='w-full'>   
                        <label htmlFor='type' className='text-[0.8rem] text-bblack'>Internship Type<span className='text-rred'>*</span></label> 
                        <div className="flex text-[0.8rem] rounded-[15px] border border-[#bbbbbb] mb-2 w-full font-original">
                            <div onClick={() => setFormData({...formData, type: "Remote"})} className={`flex-1 py-2 text-bblack ${formData.type === "Remote" && "bg-pri text-white"} text-center cursor-pointer rounded-[15px] transition-all`}>Remote</div>
                            <div onClick={() => setFormData({...formData, type: "On-Site"})} className={`flex-1 py-2 text-bblack ${formData.type === "On-Site" && "bg-pri text-white"} text-center cursor-pointer rounded-[15px] transition-all`}>On-Site</div>
                        </div> 
                        {validationErrors.type && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.type}</p>}
                    </div>            
                    <button disabled={updating} type='submit' className='bg-pri hover:opacity-90 transition-all w-full p-2.5 rounded-[15px] text-sm font-bold text-white flex justify-center items-center h-10 cursor-pointer'>
                        {updating ? <Loader color="white" bgcolor="pri" /> : "Submit"}
                    </button>   
                </form>
            </main>}
            <BackBtn />
        </>
    )
}

export default EditInternship;