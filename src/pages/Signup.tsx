import { Eye, EyeOff } from 'lucide-react';
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { SignupFormData, ToastProps } from '../utils/types';
import { studentSignUpValidationRules, type StudentSignUpValidationErrors, companySignUpValidationRules, type CompanySignUpValidationErrors } from '../utils/validationRules';
import { useSignUpMutation, } from '../app/api/auth';
import Toast from '../components/Toast';
import Loader from '../components/Loader';


const Signup: React.FC = () => {
    const [signUp, { isLoading: signingUp }] = useSignUpMutation();
    const [showPwd, setShowPwd] = useState<boolean>(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState<boolean>(false);
    const [isStudent, setIsStudent] = useState<boolean>(true);
    const [isContinuingWithGoogle, setIsContinuingWithGoogle] = useState<boolean>(false);
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [formData, setFormData] = useState<SignupFormData>({ firstname: "", lastname: "", email: "", password: "", confirmpassword: "", companyname: "", industry: "", role: "" });
    const [studentValidationErrors, setStudentValidationErrors] = useState<StudentSignUpValidationErrors>({ firstname: null, lastname: null, email: null, password: null, confirmpassword: null });
    const [companyValidationErrors, setCompanyValidationErrors] = useState<CompanySignUpValidationErrors>({ companyname: null, industry: null, email: null, password: null, confirmpassword: null });
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if(isStudent){
            setStudentValidationErrors(prev => ({...prev, [name]: null}));
        } else{
            setCompanyValidationErrors(prev => ({...prev, [name]: null}));
        }
        setFormData(prev => ({ ...prev, [name]: value })); }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(isStudent){
            const studentErrors = studentSignUpValidationRules(formData);
            setStudentValidationErrors(studentErrors)
            if(Object.values(studentErrors).filter(value => value !== null).length > 0) return 
        } else {
            const companyErrors = companySignUpValidationRules(formData);
            setCompanyValidationErrors(companyErrors)
            if(Object.values(companyErrors).filter(value => value !== null).length > 0) return}

        if(!termsAccepted) {
            setToastProps({ message: "Accept our Terms of Service before signing up!", timeout: 5000, isError: true });
            return};

        setCompanyValidationErrors({ companyname: null, industry: null, email: null, password: null, confirmpassword: null });
        setStudentValidationErrors({ firstname: null, lastname: null, email: null, password: null, confirmpassword: null })
        try{
            const body = isStudent ? { ...formData, role: "STUDENT" } : { ...formData, role: "COMPANY" };
            const response = await signUp(body).unwrap();
            if(response.message){
                setToastProps({ message: response.message, timeout: 5000, isError: false });
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
                {!isContinuingWithGoogle ? <><div className='flex flex-col items-center gap-1'>
                    <h1 className='font-original mb-4 text-pri'>Signup</h1>
                </div>
                <div className="flex text-[0.8rem] rounded-[15px] border border-[#bbbbbb] mb-2 max-w-[320px] w-full font-original">
                    <div onClick={() => setIsStudent(true)} className={`flex-1 py-2 ${isStudent && "bg-pri text-white"} text-center cursor-pointer rounded-[15px] transition-all`}>Student</div>
                    <div onClick={() => setIsStudent(false)} className={`flex-1 py-2 ${!isStudent && "bg-pri text-white"} text-center cursor-pointer rounded-[15px] transition-all`}>Company</div>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center max-w-[320px] w-full gap-2">
                    {isStudent && <><div className="w-full">
                        <label htmlFor='firstname' className='offscreen'>Firstname</label>
                        <input type="text" name='firstname' className='input-field' placeholder='Firstname' value={formData.firstname} onChange={handleInputChange} />
                        {studentValidationErrors.firstname && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentValidationErrors.firstname}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='lastname' className='offscreen'>Lastname</label>
                        <input type="text" name='lastname' className='input-field' placeholder='Lastname' value={formData.lastname} onChange={handleInputChange} />
                        {studentValidationErrors.lastname && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentValidationErrors.lastname}</p>}
                    </div></>}
                    {!isStudent && <><div className="w-full">
                        <label htmlFor='companyname' className='offscreen'>Company Name</label>
                        <input type="text" name='companyname' className='input-field' placeholder='Company Name' value={formData.companyname} onChange={handleInputChange} />
                        {companyValidationErrors.companyname && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyValidationErrors.companyname}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='industry' className='offscreen'>Industry</label>
                        <input type="text" name='industry' className='input-field' placeholder='Industry' value={formData.industry} onChange={handleInputChange} />
                        {companyValidationErrors.industry && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyValidationErrors.industry}</p>}
                    </div></>}
                    <div className="w-full">
                        <label htmlFor='email' className='offscreen'>Email</label>
                        <input type="text" name='email' className='input-field' placeholder='Email' value={formData.email} onChange={handleInputChange} />
                        {(isStudent && studentValidationErrors.email) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentValidationErrors.email}</p>}
                        {(!isStudent && companyValidationErrors.email) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyValidationErrors.email}</p>}
                    </div>
                    <div className="w-full">
                        <div className='w-full relative'>
                            <label htmlFor='password' className='offscreen'>Password</label>
                            <input type={showPwd ? "text" : "password"} name='password' className='input-field' placeholder='Password' value={formData.password} onChange={handleInputChange} />
                            {showPwd ? <EyeOff  onClick={() => setShowPwd(false)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/> : <Eye onClick={() => setShowPwd(true)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/>} 
                        </div> 
                        {(isStudent && studentValidationErrors.password) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentValidationErrors.password}</p>}
                        {(!isStudent && companyValidationErrors.password) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyValidationErrors.password}</p>}             
                    </div>
                    <div className="w-full">
                        <div className='w-full relative'>
                            <label htmlFor='confirmpassword' className='offscreen'>Confirm Password</label>
                            <input type={showConfirmPwd ? "text" : "password"} name='confirmpassword' className='input-field' placeholder='Confirm Password' value={formData.confirmpassword} onChange={handleInputChange} />
                            {showConfirmPwd ? <EyeOff  onClick={() => setShowConfirmPwd(false)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/> : <Eye onClick={() => setShowConfirmPwd(true)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/>} 
                        </div> 
                        {(isStudent && studentValidationErrors.confirmpassword) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentValidationErrors.confirmpassword}</p>}
                        {(!isStudent && companyValidationErrors.confirmpassword) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyValidationErrors.confirmpassword}</p>}                 
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" onClick={() => setTermsAccepted(prev => !prev)} />
                        <p className='text-[0.7rem]'>I understand and agree to the Terms of Service,<br></br>including the User Agreement and Privacy Policy.</p>
                    </div>
                    <button disabled={signingUp} type='submit' className='bg-pri hover:opacity-90 transition-all w-full p-2.5 rounded-[15px] text-sm font-bold text-white flex justify-center items-center h-10 cursor-pointer'>
                        {signingUp ? <Loader color="white" bgcolor="pri" /> : "Signup"}
                    </button>
                    <p className='text-[#bbbbbb] text-sm'>OR</p>
                </form>
                <button className="input-field flex justify-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors w-full max-w-[320px]" onClick={() => setIsContinuingWithGoogle(true)}>
                    <img src="/google.png" width={"20px"} />
                    <p>Continue with Google</p>
                </button>
                <div className='text-[0.75rem] flex gap-1 mt-1'>
                    <p>Don't have an account? </p>
                    <Link to={"/signin"} className='font-bold text-pri'>SignIn</Link>
                </div></> : <div className='flex flex-col items-center gap-3'>
                    <h2 className='font-original text-pri'>Continue With Google As</h2>
                    <div className='flex gap-2'>
                        <a href={`${import.meta.env.VITE_API_URL}/auth/google?role=STUDENT`} className="max-w-50 mt-2 w-full cursor-pointer">
                            <div className={`border border-gray-400 rounded-[15px] flex flex-col p-2 items-center text-pri transition-all hover:border-gray-300`}>
                                <img src="/students.png" width={"100px"} alt="" />
                                <div className='flex items-center gap-1'>
                                    <p>Student</p>
                                </div>
                            </div>
                        </a>                      
                        <a href={`${import.meta.env.VITE_API_URL}/auth/google?role=COMPANY`} className="max-w-50 mt-2 w-full cursor-pointer">
                            <div className={`border border-gray-400 rounded-[15px] flex flex-col p-2 items-center text-pri transition-all hover:border-gray-300`}>
                                <img src="/company.png" width={"100px"} alt="" />
                                <div className='flex items-center gap-1'>
                                    <p>Company</p>
                                </div>
                            </div>
                        </a>                    
                    </div>
                    <button onClick={() => setIsContinuingWithGoogle(false)} className='bg-rred rounded-[15px] flex flex-col p-2 px-5 items-center text-white hover:bg-rred/90 cursor-pointer active:bg-red-600/90 w-full'>Cancel</button>                     
                </div>}

            </div>
        </main>
    );
}

export default Signup;