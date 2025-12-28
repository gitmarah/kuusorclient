import React, { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordValidationRules } from '../utils/validationRules';
import { useForgotPasswordMutation } from '../app/api/auth';
import type { ToastProps } from '../utils/types';
import Toast from '../components/Toast';
import Loader from '../components/Loader';


const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [validationError, setValidationError] = useState<string | null>(null);
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const error = forgotPasswordValidationRules(email);
        setValidationError(error)
        if(error) return; 
        try{
            const response = await forgotPassword({ email }).unwrap();
            if(response.message) {
                setToastProps({ message: response.message, timeout: 5000, isError: false });
                setEmail("");
            }
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        }
    }

    return (
        <main className='fixed top-0 bottom-0 left-0 right-0 bg-[url("/mbbackdrop.jpg")] md:bg-[url("/backdrop.jpg")] bg-cover bg-top flex flex-col justify-end'>
            <Toast toastProps={toastProps} setToastProps={setToastProps}/>
            <div className="absolute inset-0 bg-pri/70"></div>
            <div className='flex flex-col justify-end py-10 bg-white items-center px-10 z-20 rounded-t-[50px] md:rounded-none relative'>
                <h1 className='text-xl absolute z-20 -top-4 px-2 py-1 rounded-full left-1/2 -translate-x-1/2 text-white border-3 border-white bg-pri font-coiny'>Kuusor</h1>
                <div className='flex flex-col items-center gap-1'>
                    <h2 className='text-sm font-original text-pri'>Forgot Password?</h2>
                    <h3 className='text-[0.8rem] mb-2'>Submit your email to reset your password!</h3>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-full gap-2 max-w-[320px]">
                    <div className="w-full">
                        <label htmlFor='email' className='offscreen'>Email</label>
                        <input type="text" name='email' className='input-field' placeholder='Email' value={email} onChange={(e) => {setEmail(e.target.value); setValidationError(null)}} />
                        {validationError && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationError}</p>}
                    </div>
                    <button type='submit' className='bg-pri hover:opacity-90 transition-all w-full p-2.5 rounded-[15px] text-sm font-bold text-white cursor-pointer active:scale-95 flex justify-center items-center'>
                        {isLoading ? <Loader color='white' bgcolor='transparent' /> : "Submit"}
                    </button>
                </form>
                <div className='text-[0.75rem] flex gap-1 mt-2'>
                    <p>Remember password? </p>
                    <Link to={"/signin"} className='font-bold text-pri'>Signin</Link>
                </div>
            </div>
        </main>
    );
}

export default ForgotPassword;