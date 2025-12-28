import type React from "react";
import type { ToastProps } from "../utils/types";
import { useEffect } from "react";


interface Props {
    toastProps: ToastProps,
    setToastProps: React.Dispatch<React.SetStateAction<ToastProps>>,
}


const Toast: React.FC<Props> = ({ toastProps, setToastProps }) => {

    useEffect(() => {
        let toastTimeout: number;
        if(toastProps.message){
            toastTimeout = setTimeout(() => {
                setToastProps({ message: null, isError: false, timeout: 0 })
            }, toastProps.timeout);
        }
        return () => clearTimeout(toastTimeout);
    }, [setToastProps, toastProps]);


    if(toastProps.message) return (
        <div className={`text-[0.75rem] bg-white font-bold border-2 p-3 rounded-[15px] text-green-600 border-green-600 animate-bounce fixed left-1/2 -translate-x-1/2 top-5 flex justify-center items-center max-w-sm mx-auto z-50 text-center ${toastProps.isError && "text-red-600 border-red-600"}`}>
            {toastProps.message}
        </div>
    );
}


export default Toast;