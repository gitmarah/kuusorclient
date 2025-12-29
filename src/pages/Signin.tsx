import { Eye, EyeOff } from 'lucide-react';
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { SigninFormData, ToastProps } from '../utils/types';
import { signInValidationRules, type SignInValidationErrors } from '../utils/validationRules';
import { setCredentials } from '../app/authSlice';
import { useSignInMutation } from '../app/api/auth';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import Toast from '../components/Toast';
import Loader from '../components/Loader';


const Signin: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.auth.token);
    const [signIn, { isLoading: signingIn }] = useSignInMutation();
    const [showPwd, setShowPwd] = useState<boolean>(false);
    const [isContinuingWithGoogle, setIsContinuingWithGoogle] = useState<boolean>(false);
    const [formData, setFormData] = useState<SigninFormData>({ email: "", password: "" });
    const [validationErrors, setValidationErrors] = useState<SignInValidationErrors>({ email: null, password: null });
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });

    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    useEffect(() => {
        if(type === "emailverification") setToastProps({ message: "Email verified! Sign in to access your account.", timeout: 5000, isError: false });
    }, [type]);
    useEffect(() => {
        if(token) navigate("/");
    }, [navigate, token]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValidationErrors(prev => ({...prev, [name]: null}));
        setFormData(prev => ({ ...prev, [name]: value })); }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = signInValidationRules(formData);
        setValidationErrors(errors)
        if(Object.values(errors).filter(value => value !== null).length > 0) return
        try{
            const response = await signIn(formData).unwrap();
            if(response.token) {
                dispatch(setCredentials(response));
                navigate("/");}
            if(response.message) setToastProps({ message: response.message, timeout: 5000, isError: false });
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        } }

    return (
        <main className='fixed top-0 bottom-0 left-0 right-0 bg-[url("/mbbackdrop.jpg")] md:bg-[url("/backdrop.jpg")] bg-cover bg-top flex flex-col justify-end'>
            <div className="absolute inset-0 bg-pri/70"></div>
            <div className='flex flex-col justify-end py-10 bg-white items-center px-10 z-20 rounded-t-[50px] md:rounded-none relative'>
                <h1 className='text-xl absolute z-20 -top-4 px-2 py-1 rounded-full left-1/2 -translate-x-1/2 text-white border-3 border-white bg-pri font-coiny'>Kuusor</h1>
                <Toast toastProps={toastProps} setToastProps={setToastProps}/>
                {!isContinuingWithGoogle ? <><div className='flex flex-col items-center gap-1'>
                    <h2 className='font-original mb-4 text-pri'>Signin</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col max-w-87.5 justify-center items-center w-full gap-2">
                    <div className="w-full">
                        <label htmlFor='email' className='offscreen'>Email</label>
                        <input type="text" name='email' className='input-field' placeholder='Email' value={formData.email} onChange={handleInputChange} />
                        {validationErrors.email && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.email}</p>}
                    </div>
                    <div className="w-full">
                        <div className='w-full relative'>
                            <label htmlFor='password' className='offscreen'>Password</label>
                            <input type={showPwd ? "text" : "password"} name='password' className='input-field' placeholder='Password' value={formData.password} onChange={handleInputChange} />
                            {showPwd ? <EyeOff  onClick={() => setShowPwd(false)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/> : <Eye onClick={() => setShowPwd(true)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/>} 
                        </div> 
                        {validationErrors.password && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.password}</p>}                  
                    </div>
                    <button disabled={signingIn} type='submit' className='bg-pri hover:opacity-90 transition-all w-full p-2.5 rounded-[15px] text-sm font-bold text-white flex justify-center items-center h-10 cursor-pointer'>
                        {signingIn ? <Loader color="white" bgcolor="pri" /> : "Signin"}
                    </button>
                    <p className='text-[#bbbbbb] text-sm'>OR</p>
                </form>
                <button onClick={() => setIsContinuingWithGoogle(true)} className="input-field flex justify-center gap-1 max-w-87.5 mt-2 cursor-pointer">
                    <img src="/google.png" width={"20px"} />
                    <p>Continue with Google</p>
                </button>
                <div className='text-[0.8rem] flex gap-1 mt-2'>
                    <p>Don't have an account? </p>
                    <Link to={"/signup"} className='font-bold text-pri'>Signup</Link>
                </div>
                <Link to={"/forgotpassword"} className='text-[0.8rem] underline font-bold text-pri mt-1' >Forgot Password?</Link></> :
                <div className='flex flex-col items-center gap-3'>
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

export default Signin;