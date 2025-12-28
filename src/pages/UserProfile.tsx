import { BookOpen, CircleCheck, Earth, Eye, FileUp, Github, Layers, Linkedin, Mail, RefreshCcw, School } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useSignOutMutation } from '../app/api/auth';
import Loader from '../components/Loader';
import { clearCredentials, setUser } from '../app/authSlice';
import type { ToastProps } from '../utils/types';
import Toast from '../components/Toast';
import BackBtn from '../components/BackBtn';
import { useGetUserQuery, useUploadResumeMutation } from '../app/api/user';
import { skipToken } from '@reduxjs/toolkit/query';
import ProfileSkeleton from '../components/ProfileSkeleton';
import Header from '../components/Header';


const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const params = useParams();
    const { data: user, isLoading: fetchingUser } = useGetUserQuery(params.id ?? skipToken);
    const userId = useAppSelector(state => state.auth.user)?.id;
    const [signOut, { isLoading: signingOut }] = useSignOutMutation();
    const [uploadResume, { isLoading: uploadingResume }] = useUploadResumeMutation();
    const [resume, setResume] = useState<Blob | null>(null);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [showResumeUpload, setShowResumeUpload] = useState<boolean>(false);
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });



    const handleResumeUpload = async () => {
        const body = new FormData();
        if(!resume) {setToastProps({ message: "No resume selected!", timeout: 5000, isError: true }); return;}
        body.append("resume", resume);
        try{
            if(!user?.id) return;
            const response = await uploadResume({body, id: user?.id}).unwrap();
            if(response){
                dispatch(setUser(response));
                setShowResumeUpload(false);
            }
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        } }


    useEffect(() => {
        if(resume) setShowResumeUpload(true); else setShowResumeUpload(false);
    }, [resume]);
    useEffect(() => {
        if(user) setIsOwner(user.id === userId);
    }, [user, userId]);


    const handleSignout = async () => {
        try{
            const response = await signOut(null).unwrap();
            if(response.message){
                dispatch(clearCredentials());
                navigate("/")
            }
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        } }

    const getLevel = (level: string): string => {
        if(level === "Year 3") return "Qualifying Year";
        if(level === "Year 4") return "Final Year";
        return level; }

    if(fetchingUser) return <ProfileSkeleton />;

    if(!user) return (
        <div className='w-full fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center'>
            <h2 className='font-original font-bold text-center text-pri px-4 mb-1 text-md'>Unable to fetch user!</h2>
            <img src="/notgood.png" className='w-40' />
            <button onClick={() => location.href = `${location.origin}${location.pathname.slice(0,)}`} className='bg-pri px-2.5 py-1 text-white rounded-md mt-1 flex items-center gap-1 active:scale-95 hover:opacity-95 transition-all cursor-pointer'><RefreshCcw size={15} /> Refresh</button>
        </div>);

    return (
        <>
            <div className='hidden md:flex'><Header /></div>
            <main className='fixed top-0 bottom-0 md:bottom-auto left-0 right-0 flex flex-col justify-end md:max-w-3/4 md:mx-auto md:border md:border-gray-200 md:shadow-sm md:m-5 md:rounded-[25px] md:overflow-hidden md:mt-17 lg:max-w-1/2'>
                
                <div className="absolute md:bg-transparent inset-0 bg-pri"></div>
                <div className='flex flex-col gap-2 p-7 w-full md:bg-pri z-30 text-white'>
                    <Toast toastProps={toastProps} setToastProps={setToastProps}/>
                    <div className='flex items-center gap-2 '>
                        <div className='w-20 aspect-square rounded-full overflow-hidden'>
                            <img src={user?.profileUrl ?? "/profile.jpg"} />
                        </div>
                        <div className='flex flex-col'>
                            <h2 className='font-bold'>{user?.role === "COMPANY" ? `${user?.companyname}` : `${user?.firstname} ${user?.lastname}`}</h2>
                            <p className='text-[0.8rem] -mt-0.5'>{user?.address}</p>
                            <p className='text-[0.8rem] -mt-0.5'>{user?.role === "COMPANY" ?user?.industry : user?.specialty}</p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        {isOwner && <><button onClick={() => navigate(`/editprofile`)} className='bg-white text-[0.8rem] rounded-md py-1 w-23 text-pri font-semibold active:scale-95 hover:opacity-95 transition-all cursor-pointer'>Edit Profile</button>
                        <button onClick={handleSignout} className='bg-rred text-[0.8rem] rounded-md py-1 w-20 h-8 font-semibold flex justify-center items-center active:scale-95 hover:opacity-95 transition-all cursor-pointer'>{signingOut ? <Loader color='white' bgcolor='transparent' /> : "Signout"}</button>
                        {user?.role === "STUDENT" && <><label htmlFor='resume' className='bg-white flex justify-center items-center text-pri w-8 aspect-square rounded-full active:scale-95 hover:opacity-95 transition-all cursor-pointer'>
                            <FileUp size={20} />
                        </label>
                        {user.resumeUrl && <a href={user?.resumeUrl} className='bg-white flex justify-center items-center text-pri w-8 aspect-square rounded-full active:scale-95 hover:opacity-95 transition-all cursor-pointer'>
                            <Eye size={20} />
                        </a>}
                        <input type="file" accept='.pdf' name='resume' id="resume" onChange={(e) => {setResume(e.target.files?.[0] as Blob)}} className='hidden' /></>}</>}
                        {!isOwner && <>{user?.resumeUrl && <a href={user?.resumeUrl} className='bg-white text-center text-[0.8rem] rounded-md py-1 w-23 text-pri font-semibold'>View CV</a>}
                        {user?.role === "COMPANY" && <div className='flex text-pri gap-1 bg-white text-[0.7rem] items-center px-2 py-0.5 rounded-full'>
                            <CircleCheck size={13} strokeWidth={3} />
                            <p className='font-semibold'>Verified Company</p>
                        </div>}
                        {user?.role === "STUDENT" && <a href={`mailto:${user?.email}`} className='bg-white flex justify-center items-center text-pri rounded-md px-2 py-1 gap-0.5 active:scale-95 hover:opacity-95 transition-all cursor-pointer'>
                            <Mail size={17} />
                            <p className='text-[0.8rem]'>Send Mail</p>
                        </a>}</>}
                    </div>
                </div>
                <div className='flex flex-col gap-4 flex-1 px-7 py-9 bg-white z-20 rounded-t-[50px] md:rounded-none relative text-[0.85rem]'>
                    <div className='w-30 h-1.5 bg-pri rounded-full absolute top-1 left-1/2 -translate-x-1/2'></div>
                    <div>
                        <h3 className='text-gray-400'>About</h3>
                        <p className='leading-5.5 text-bblack md:w-3/4'>{user?.about ? user.about : "N/A"}</p>
                    </div>
                    {user?.role === "STUDENT" && <div className='flex flex-col gap-1 text-bblack'>
                        <h3 className='text-gray-400'>University Details</h3>
                        <div className='flex items-center gap-1'>
                            <School size={15} strokeWidth={2.5} />
                            <p className='font-bold'>{user?.university || "N/A"}</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <BookOpen size={15} strokeWidth={2.5} />
                            <p>{user?.course || "N/A"}</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Layers size={15} strokeWidth={2.5} />
                            <p>{getLevel(user?.level) || "N/A"}</p>
                        </div>
                    </div>}
                    <div className='flex flex-col gap-1'>
                        <h3 className='text-gray-400'>Links</h3>
                        {isOwner && <div className='flex flex-col gap-2 w-full'>
                            <div className='flex items-center gap-1 font-semibold text-pri active:scale-95 hover:opacity-95 transition-all cursor-pointer'>
                                <Earth size={15} strokeWidth={2.5} />
                                {user?.website ? <a href={user?.website}>Website</a> : "N/A"}
                            </div>
                            <div className='flex items-center gap-1 font-semibold text-pri active:scale-95 hover:opacity-95 transition-all cursor-pointer'>
                                <Linkedin size={15} strokeWidth={2.5} />
                                {user?.linkedin ? <a href={user?.linkedin}>LinkedIn</a> : "N/A"}
                            </div>
                            <div className='flex items-center gap-1 font-semibold text-pri active:scale-95 hover:opacity-95 transition-all cursor-pointer'>
                                <Github size={15} strokeWidth={2.5} />
                                {user?.github ? <a href={user?.github}>Github</a> : "N/A"}
                            </div>
                        </div>}
                        {!isOwner && <div className='flex flex-col gap-2 w-full'>
                            {user?.website && <div className='flex items-center gap-1 font-semibold text-pri'>
                                <Earth size={15} strokeWidth={2.5} />
                                <a href={user.website}>Website</a>
                            </div>}
                            {user?.linkedin && <div className='flex items-center gap-1 font-semibold text-pri'>
                                <Linkedin size={15} strokeWidth={2.5} />
                                <a href={user.linkedin}>LinkedIn</a>
                            </div>}
                            {user?.github && <div className='flex items-center gap-1 font-semibold text-pri'>
                                <Github size={15} strokeWidth={2.5} />
                                <a href={user.github}>Github</a>
                            </div>}
                        </div>}
                    </div>
                    <BackBtn />
                </div>
                {showResumeUpload && <>
                    <div onClick={() => setShowResumeUpload(false)} className='fixed top-0 left-0 bottom-0 right-0 z-40 bg-black/80'></div>
                    <div className='absolute bg-white top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-50 p-5 rounded-[15px] max-w-[300px] w-full flex flex-col items-center gap-1'>
                    {uploadingResume ? <div className='w-full flex flex-col justify-center items-center'>
                            <p className='font-coiny text-pri'>Uploading Resume</p>
                            <Loader color='pri' bgcolor='transparent' />
                        </div> : <><div className='flex flex-col items-center text-center'>
                            <p>Are you sure you want to upload <span className='font-bold -mt-0.5 text-center'>{(resume as File)?.name}</span> as your resume?</p>
                        </div>
                        <div className='flex gap-2'>
                            <button onClick={() => setShowResumeUpload(false)} className='bg-rred text-white h-7 w-14 rounded-md active:scale-95 hover:opacity-95 transition-all cursor-pointer'>No</button>
                            <button onClick={handleResumeUpload} className='bg-pri text-white h-7 w-14 rounded-md active:scale-95 hover:opacity-95 transition-all cursor-pointer'>Yes</button>
                        </div></>}
                    </div>
                </>}
            </main>
        </>
    );
}

export default UserProfile;