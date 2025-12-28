import { Eye, EyeOff } from 'lucide-react';
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { PasswordResetFormData, ToastProps } from '../utils/types';
import { resetPasswordValidationRules, type ResetPasswordValidationErrors } from '../utils/validationRules';
import { useResetPasswordMutation } from '../app/api/auth';
import Toast from '../components/Toast';
import Loader from '../components/Loader';


const ResetPassword: React.FC = () => {

    const [params] = useSearchParams();
    const token = params.get("token");
    const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();
    const [showPwd, setShowPwd] = useState<boolean>(false);
    const [showCPwd, setShowCPwd] = useState<boolean>(false);
    const [formData, setFormData] = useState<PasswordResetFormData>({ password: "", confirmpassword: "" });
    const [validationErrors, setValidationErrors] = useState<ResetPasswordValidationErrors>({ password: null, confirmpassword: null });
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValidationErrors(prev => ({...prev, [name]: null}));
        setFormData(prev => ({ ...prev, [name]: value })); }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = resetPasswordValidationRules(formData);
        setValidationErrors(errors)
        if(Object.values(errors).filter(value => value !== null).length > 0) return 
        if(!token) {
            setToastProps({ message: "Token is required to reset password!", timeout: 5000, isError: true });
            return; }
        try{
            const response = await resetPassword({password: formData.password, token }).unwrap();
            if(response.message) setToastProps({ message: response.message, timeout: 5000, isError: false });
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
                    <h2 className='text-sm font-original text-pri'>Reset Password</h2>
                    <h3 className='text-[0.8rem] mb-2'>Submit new password to reset!</h3>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-full gap-2 max-w-[320px]">
                    <div className="w-full">
                        <div className='w-full relative'>
                            <label htmlFor='password' className='offscreen'>Password</label>
                            <input type={showPwd ? "text" : "password"} name='password' className='input-field' placeholder='Password' value={formData.password} onChange={handleInputChange} />
                            {showPwd ? <EyeOff  onClick={() => setShowPwd(false)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/> : <Eye onClick={() => setShowPwd(true)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/>} 
                        </div> 
                        {validationErrors.password && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.password}</p>}                  
                    </div>
                    <div className="w-full">
                        <div className='w-full relative'>
                            <label htmlFor='confirmpassword' className='offscreen'>Confirm Password</label>
                            <input type={showCPwd ? "text" : "password"} name='confirmpassword' className='input-field' placeholder='Confirm Password' value={formData.confirmpassword} onChange={handleInputChange} />
                            {showCPwd ? <EyeOff  onClick={() => setShowCPwd(false)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer'/> : <Eye onClick={() => setShowCPwd(true)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer'/>} 
                        </div> 
                        {validationErrors.confirmpassword && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.confirmpassword}</p>}                  
                    </div>
                    <button type='submit' className='bg-pri hover:opacity-90 active:scale-95 transition-all w-full p-2.5 rounded-[15px] text-sm font-bold text-white flex justify-center items-center cursor-pointer'>
                        {resetting ? <Loader color='white' bgcolor='transparent' /> : "Reset Password"}
                    </button>
                </form>
                <div className='text-[0.75rem] flex gap-1 mt-1'>
                    <p>Remember Password? </p>
                    <Link to={"/signin"} className='font-bold text-pri'>Signin</Link>
                </div>
            </div>
        </main>
    );
}

export default ResetPassword;