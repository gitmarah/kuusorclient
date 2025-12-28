import { ArrowRight, Eye, EyeOff, UserPen } from 'lucide-react';
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import type { CompleteProfileFormData, ToastProps } from '../utils/types';
import { companyCPValidationRules, type CompanyCPValidationErrors, studentCPValidationRules, type StudentCPValidationErrors, type LinksValidationErrors, LinksValidationRules } from '../utils/validationRules';
import Toast from '../components/Toast';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useUpdateProfileMutation } from '../app/api/user';
import Loader from '../components/Loader';
import { setUser } from '../app/authSlice';
import { useNavigate } from 'react-router-dom';


const CompleteProfile: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user);
    const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();
    const [showPwd, setShowPwd] = useState<boolean>(false);
    const [updateLinks, setUpdateLinks] = useState<boolean>(false);
    const [newprofileUrl, setNewprofileUrl] = useState<string>("");
    const [showConfirmPwd, setShowConfirmPwd] = useState<boolean>(false);
    const [isStudent] = useState<boolean>(user?.role === "STUDENT" ? true : false);
    const [formData, setFormData] = useState<CompleteProfileFormData>({ firstname: "", lastname: "", address: "", password: "", confirmpassword: "", companyname: "", industry: "", role: "", website: "", linkedin: "", github: "", profile: null });
    const [studentCPValidationErrors, setStudentCPValidationErrors] = useState<StudentCPValidationErrors>({ firstname: null, lastname: null, address: null, password: null, confirmpassword: null});
    const [companyCPValidationErrors, setCompanyCPValidationErrors] = useState<CompanyCPValidationErrors>({ companyname: null, industry: null, address: null, password: null, confirmpassword: null});
    const [linksValidationErrors, setLinksValidationErrors] = useState<LinksValidationErrors>({ github: null, linkedin: null, website: null });
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });

    useEffect(() => {
        console.log(isStudent);
    }, [isStudent]);

    useEffect(() => {
        if(user){
            if(!user.isNewUser) navigate("/");
            setFormData({...formData, 
                companyname: user.companyname || "", 
                industry: user.industry || "",
                address: user.address || "",
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                website: user.website || "",
                github: user.github || "",
                linkedin: user.linkedin || "",
            })
        }
    }, [user]);


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if(isStudent){
            setStudentCPValidationErrors(prev => ({...prev, [name]: null}));
        } else{
            setCompanyCPValidationErrors(prev => ({...prev, [name]: null}));
        }
        setLinksValidationErrors(prev => ({ ...prev, [name]: null }))
        setFormData(prev => ({ ...prev, [name]: value })); }


    const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if(!files?.[0]) return;
        setNewprofileUrl(URL.createObjectURL(files?.[0]));
        if(isStudent){
            setStudentCPValidationErrors(prev => ({...prev, [name]: null}));
        } else{
            setCompanyCPValidationErrors(prev => ({...prev, [name]: null}));
        }
        setFormData(prev => ({ ...prev, [name]: files?.[0] })); }


    const handleContinueToUpdateLinks = () => {
        if(isStudent){
            const studentErrors = studentCPValidationRules(formData);
            setStudentCPValidationErrors(studentErrors);
            if(Object.values(studentErrors).filter(value => value !== null).length > 0) return;
            setFormData({ ...formData, role: "STUDENT" });
        } else {
            const companyErrors = companyCPValidationRules(formData);
            setCompanyCPValidationErrors(companyErrors);
            if(Object.values(companyErrors).filter(value => value !== null).length > 0) return
            setFormData({ ...formData, role: "COMPANY" })}

        setCompanyCPValidationErrors({ companyname: null, industry: null, address: null, password: null, confirmpassword: null });
        setStudentCPValidationErrors({ firstname: null, lastname: null, address: null, password: null, confirmpassword: null });
        setLinksValidationErrors({ github: null, linkedin: null, website: null });
        setUpdateLinks(true); }


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = LinksValidationRules(formData);
        setLinksValidationErrors(errors);
        if(Object.values(errors).filter(value => value !== null).length > 0) return;
        const body = new FormData();
        body.append("firstname", formData.firstname ?? "");
        body.append("lastname", formData.lastname ?? "");
        body.append("address", formData.address ?? "");
        body.append("companyname", formData.companyname ?? "");
        body.append("industry", formData.industry ?? "");
        body.append("password", formData.password ?? "");
        body.append("github", formData.github ?? "");
        body.append("linkedin", formData.linkedin ?? "");
        body.append("website", formData.website ?? "");
        if(formData.profile) body.append("profile", formData.profile ?? "");

        try{
            if(!user?.id) return;
            const response = await updateProfile({body, id: user?.id}).unwrap();
            if(response){
                dispatch(setUser(response))
                console.log(response);
            }
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        }
    }


    return (
        <main className='fixed top-0 bottom-0 left-0 right-0 bg-[url("/mbbackdrop.jpg")] md:bg-[url("/backdrop.jpg")] bg-cover bg-center md:bg-top flex flex-col justify-end'>
            <div className="absolute inset-0 bg-pri/70"></div>
            <div className='flex flex-col justify-end py-10 bg-white items-center px-10 z-20 rounded-t-[50px] relative'>
                <Toast toastProps={toastProps} setToastProps={setToastProps}/>
                <h1 className='text-xl absolute z-20 -top-4 px-2 py-1 rounded-full left-1/2 -translate-x-1/2 text-white border-3 border-white bg-pri font-coiny'>Kuusor</h1>                
                {!updateLinks ? <><div className='flex flex-col items-center gap-1'>
                    <h2 className='font-original mb-4 text-pri'>Complete your profile!</h2>
                </div>
                <div className='mb-2 relative'>
                    {(user?.profileUrl && !newprofileUrl) && <img src={user.profileUrl} className='w-25 aspect-square rounded-full border object-cover object-top border-gray-200' />}
                    {(!user?.profileUrl && !newprofileUrl) && <img src={"/profile.jpg"} className='w-25 aspect-square rounded-full border object-cover object-top border-gray-200' />}
                    {newprofileUrl && <img src={newprofileUrl ? newprofileUrl : "/profile.jpg"} className='w-25 aspect-square rounded-full border object-cover object-top border-gray-200' />}
                    <label htmlFor='profile' className='w-7 aspect-square rounded-full bg-white cursor-pointer absolute border border-gray-200 right-1.5 bottom-1.5 flex justify-center items-center'><UserPen size={15} className='text-pri' /></label>
                    <input type='file' className='hidden' name="profile" id="profile" onChange={(e) => handleProfileChange(e)} />
                </div></> : <div className='flex flex-col items-center gap-1'>
                    <h2 className='font-original mb-4 text-pri'>Add your Social Links!</h2>
                </div>}
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center max-w-[320px] w-full gap-2">
                    {!updateLinks ? <>{isStudent && <><div className="w-full">
                        <label htmlFor='firstname' className='offscreen'>Firstname</label>
                        <input type="text" name='firstname' className='input-field' placeholder='Firstname' value={formData.firstname} onChange={handleInputChange} />
                        {(isStudent && studentCPValidationErrors.firstname) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentCPValidationErrors.firstname}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='lastname' className='offscreen'>Lastname</label>
                        <input type="text" name='lastname' className='input-field' placeholder='Lastname' value={formData.lastname} onChange={handleInputChange} />
                        {studentCPValidationErrors.lastname && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentCPValidationErrors.lastname}</p>}
                    </div></>}
                    {!isStudent && <><div className="w-full">
                        <label htmlFor='companyname' className='offscreen'>Company Name</label>
                        <input type="text" name='companyname' className='input-field' placeholder='Company Name' value={formData.companyname} onChange={handleInputChange} />
                        {companyCPValidationErrors.companyname && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyCPValidationErrors.companyname}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='industry' className='offscreen'>Industry</label>
                        <input type="text" name='industry' className='input-field' placeholder='Industry' value={formData.industry} onChange={handleInputChange} />
                        {companyCPValidationErrors.industry && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyCPValidationErrors.industry}</p>}
                    </div></>}
                    <div className="w-full">
                        <label htmlFor='address' className='offscreen'>Address</label>
                        <input type="text" name='address' className='input-field' placeholder='Address (Freetown, Sierra Leone)' value={formData.address} onChange={handleInputChange} />
                        {(isStudent && studentCPValidationErrors.address) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentCPValidationErrors.address}</p>}
                        {(!isStudent && companyCPValidationErrors.address) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyCPValidationErrors.address}</p>}
                    </div>
                    <div className="w-full">
                        <div className='w-full relative'>
                            <label htmlFor='password' className='offscreen'>Password</label>
                            <input type={showPwd ? "text" : "password"} name='password' className='input-field' placeholder='Password' value={formData.password} onChange={handleInputChange} />
                            {showPwd ? <EyeOff  onClick={() => setShowPwd(false)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/> : <Eye onClick={() => setShowPwd(true)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/>} 
                        </div> 
                        {(isStudent && studentCPValidationErrors.password) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentCPValidationErrors.password}</p>}
                        {(!isStudent && companyCPValidationErrors.password) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyCPValidationErrors.password}</p>}             
                    </div>
                    <div className="w-full">
                        <div className='w-full relative'>
                            <label htmlFor='confirmpassword' className='offscreen'>Confirm Password</label>
                            <input type={showConfirmPwd ? "text" : "password"} name='confirmpassword' className='input-field' placeholder='Confirm Password' value={formData.confirmpassword} onChange={handleInputChange} />
                            {showConfirmPwd ? <EyeOff  onClick={() => setShowConfirmPwd(false)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/> : <Eye onClick={() => setShowConfirmPwd(true)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/>} 
                        </div> 
                        {(isStudent && studentCPValidationErrors.confirmpassword) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentCPValidationErrors.confirmpassword}</p>}
                        {(!isStudent && companyCPValidationErrors.confirmpassword) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyCPValidationErrors.confirmpassword}</p>}                 
                    </div></> : <>
                        <div className="w-full">
                            <label htmlFor='website' className='offscreen'>Website</label>
                            <input type="text" name='website' className='input-field' placeholder='Website' value={formData.website} onChange={handleInputChange} />
                            {linksValidationErrors.website && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{linksValidationErrors.website}</p>}
                        </div>
                        <div className="w-full">
                            <label htmlFor='linkedin' className='offscreen'>Linkedin</label>
                            <input type="text" name='linkedin' className='input-field' placeholder='Linkedin' value={formData.linkedin} onChange={handleInputChange} />
                            {linksValidationErrors.linkedin && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{linksValidationErrors.linkedin}</p>}
                        </div>
                        <div className="w-full">
                            <label htmlFor='github' className='offscreen'>Github</label>
                            <input type="text" name='github' className='input-field' placeholder='Github' value={formData.github} onChange={handleInputChange} />
                            {linksValidationErrors.github && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{linksValidationErrors.github}</p>}
                        </div>
                    </>}
                    {updateLinks && <><button onClick={() => setUpdateLinks(true)} type='submit' className='bg-pri hover:opacity-90 transition-all w-full p-2.5 rounded-[15px] text-sm font-bold text-white flex justify-center items-center h-10 cursor-pointer gap-1'>
                        {updatingProfile ? <Loader color='white' bgcolor='transparent' /> : "Continue"}
                        <ArrowRight size={15} />                    
                    </button>
                    <button className='text-gray-400 underline cursor-pointer hover:text-gray-400/90 active:text-gray-400/80 text-sm' onClick={() => setUpdateLinks(false)}>Go Back</button></>}
                </form>
                {!updateLinks && <button onClick={handleContinueToUpdateLinks} type='submit' className='bg-pri max-w-[320px] hover:opacity-90 transition-all w-full p-2.5 rounded-[15px] text-sm font-bold text-white flex justify-center items-center h-10 cursor-pointer gap-1 mt-2'>
                    <p>Continue</p>
                    <ArrowRight size={15} />
                </button>}
            </div>
        </main>); }


export default CompleteProfile;