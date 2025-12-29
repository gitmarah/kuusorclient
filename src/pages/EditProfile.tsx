import { ArrowRight, UserPen } from 'lucide-react';
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import type { UpdateProfileFormData, ToastProps } from '../utils/types';
import { type CompanyEPValidationErrors, type LinksValidationErrors, LinksValidationRules, type StudentEPValidationErrors, studentEPValidationRules, companyEPValidationRules } from '../utils/validationRules';
import Toast from '../components/Toast';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useUpdateProfileMutation } from '../app/api/user';
import Loader from '../components/Loader';
import { setUser } from '../app/authSlice';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BackBtn from '../components/BackBtn';


const EditProfile: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user);
    const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();
    const [newprofileUrl, setNewprofileUrl] = useState<string>("");
    const [isStudent] = useState<boolean>(user?.role === "STUDENT" ? true : false);
    const [formData, setFormData] = useState<UpdateProfileFormData>({ firstname: "", lastname: "", address: "", password: "", confirmpassword: "", companyname: "", industry: "", role: "", website: "", linkedin: "", github: "", about: "", university: "", level: "", course: "", specialty: "", profile: null });
    const [studentEPValidationErrors, setStudentEPValidationErrors] = useState<StudentEPValidationErrors>({ firstname: null, lastname: null, address: null, about: null, university: null, course: null, level: null, specialty: null});
    const [companyEPValidationErrors, setCompanyEPValidationErrors] = useState<CompanyEPValidationErrors>({ companyname: null, industry: null, address: null, about: null});
    const [linksValidationErrors, setLinksValidationErrors] = useState<LinksValidationErrors>({ github: null, linkedin: null, website: null });
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });

    useEffect(() => {
        if(user){
            setFormData({...formData, 
                companyname: user.companyname || "", 
                industry: user.industry || "",
                address: user.address || "",
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                website: user.website || "",
                about: user.about || "",
                github: user.github || "",
                linkedin: user.linkedin || "",
                specialty: user.specialty || "",
                university: user.university || "",
                course: user.course || "",
                level: user.level || "",
            })
        }
    }, [user]);


    const handleInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if(isStudent){
            setStudentEPValidationErrors(prev => ({...prev, [name]: null}));
        } else{
            setCompanyEPValidationErrors(prev => ({...prev, [name]: null}));
        }
        setLinksValidationErrors(prev => ({ ...prev, [name]: null }))
        setFormData(prev => ({ ...prev, [name]: value })); }


    const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if(!files?.[0]) return;
        setNewprofileUrl(URL.createObjectURL(files?.[0]));
        if(isStudent){
            setStudentEPValidationErrors(prev => ({...prev, [name]: null}));
        } else{
            setCompanyEPValidationErrors(prev => ({...prev, [name]: null}));
        }
        setFormData(prev => ({ ...prev, [name]: files?.[0] })); }


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = LinksValidationRules(formData);
        setLinksValidationErrors(errors);
        if(Object.values(errors).filter(value => value !== null).length > 0) return;
        if(isStudent){
            const studentErrors = studentEPValidationRules(formData);
            setStudentEPValidationErrors(studentErrors);
            if(Object.values(studentErrors).filter(value => value !== null).length > 0) return;
            setFormData({ ...formData, role: "STUDENT" });
        } else {
            const companyErrors = companyEPValidationRules(formData);
            setCompanyEPValidationErrors(companyErrors);
            if(Object.values(companyErrors).filter(value => value !== null).length > 0) return
            setFormData({ ...formData, role: "COMPANY" })}

        setCompanyEPValidationErrors({ companyname: null, industry: null, address: null, about: null });
        setStudentEPValidationErrors({ firstname: null, lastname: null, address: null, about: null, university: null, course: null, level: null, specialty: null });
        setLinksValidationErrors({ github: null, linkedin: null, website: null });
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
        body.append("university", formData.university ?? "");
        body.append("specialty", formData.specialty ?? "");
        body.append("level", formData.level ?? "");
        body.append("course", formData.course ?? "");
        body.append("about", formData.about ?? "");
        if(formData.profile) body.append("profile", formData.profile ?? "");

        try{
            if(!user?.id) return;
            const response = await updateProfile({body, id: user?.id}).unwrap();
            if(response){
                dispatch(setUser(response));
                navigate(`/profile/${user?.id}`);
            }
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        }
    }


    return (
        <>
        <Header />
        <main className='fixed top-0 bottom-0 left-0 right-0 flex flex-col overflow-y-scroll'>
            <div className={`flex flex-col justify-end py-5 items-center px-7 relative`}>
                <Toast toastProps={toastProps} setToastProps={setToastProps}/>            
                <div className='flex flex-col items-center gap-1'>
                    <h2 className='font-original mb-4 text-pri'>Edit your profile!</h2>
                </div>
                <div className='mb-2 relative'>
                    {(user?.profileUrl && !newprofileUrl) && <img src={user.profileUrl} className='w-25 aspect-square rounded-full border object-cover object-top border-gray-200' />}
                    {(!user?.profileUrl && !newprofileUrl) && <img src={"/profile.jpg"} className='w-25 aspect-square rounded-full border object-cover object-top border-gray-200' />}
                    {newprofileUrl && <img src={newprofileUrl ? newprofileUrl : "/profile.jpg"} className='w-25 aspect-square rounded-full border object-cover object-top border-gray-200' />}
                    <label htmlFor='profile' className='w-7 aspect-square rounded-full bg-white cursor-pointer absolute border border-gray-200 right-1.5 bottom-1.5 flex justify-center items-center'><UserPen size={15} className='text-pri' /></label>
                    <input type='file' className='hidden' name="profile" id="profile" onChange={(e) => handleProfileChange(e)} />
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center max-w-[320px] w-full gap-2 md:gap-1">
                    {isStudent && <><div className="w-full">
                        <label htmlFor='firstname' className='text-[0.75rem] text-gray-400'>Firstname<span className='text-rred'>*</span></label>
                        <input type="text" name='firstname' className='input-field' placeholder='Firstname' value={formData.firstname} onChange={handleInputChange} />
                        {studentEPValidationErrors.firstname && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentEPValidationErrors.firstname}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='lastname' className='text-[0.75rem] text-gray-400'>Lastname<span className='text-rred'>*</span></label>
                        <input type="text" name='lastname' className='input-field' placeholder='Lastname' value={formData.lastname} onChange={handleInputChange} />
                        {studentEPValidationErrors.lastname && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentEPValidationErrors.lastname}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='specialty' className='text-[0.75rem] text-gray-400'>Specialty<span className='text-rred'>*</span></label>
                        <input type="text" name='specialty' className='input-field' placeholder='Specialty' value={formData.specialty} onChange={handleInputChange} />
                        {studentEPValidationErrors.specialty && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentEPValidationErrors.specialty}</p>}
                    </div></>}
                    {!isStudent && <><div className="w-full">
                        <label htmlFor='companyname' className='text-[0.75rem] text-gray-400'>Company Name<span className='text-rred'>*</span></label>
                        <input type="text" name='companyname' className='input-field' placeholder='Company Name' value={formData.companyname} onChange={handleInputChange} />
                        {companyEPValidationErrors.companyname && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyEPValidationErrors.companyname}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='industry' className='text-[0.75rem] text-gray-400'>Industry<span className='text-rred'>*</span></label>
                        <input type="text" name='industry' className='input-field' placeholder='Industry' value={formData.industry} onChange={handleInputChange} />
                        {companyEPValidationErrors.industry && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyEPValidationErrors.industry}</p>}
                    </div></>}
                    <div className="w-full">
                        <label htmlFor='address' className='text-[0.75rem] text-gray-400'>Address<span className='text-rred'>*</span></label>
                        <input type="text" name='address' className='input-field' placeholder='Address (Freetown, Sierra Leone)' value={formData.address} onChange={handleInputChange} />
                        {(isStudent && studentEPValidationErrors.address) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentEPValidationErrors.address}</p>}
                        {(!isStudent && companyEPValidationErrors.address) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyEPValidationErrors.address}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='about' className='text-[0.75rem] text-gray-400'>About<span className='text-rred'>*</span></label>
                        <textarea rows={5} name='about' className='input-field hide-scrollbar' placeholder='About' value={formData.about} onChange={handleInputChange} />
                        {(isStudent && studentEPValidationErrors.about) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentEPValidationErrors.about}</p>}
                        {(!isStudent && companyEPValidationErrors.about) && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{companyEPValidationErrors.about}</p>}
                    </div>
                    {isStudent && <><div className="w-full">
                        <label htmlFor='university' className='text-[0.75rem] text-gray-400'>University<span className='text-rred'>*</span></label>
                        <input type="text" name='university' className='input-field' placeholder='University' value={formData.university} onChange={handleInputChange} />
                        {studentEPValidationErrors.university && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentEPValidationErrors.university}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='course' className='text-[0.75rem] text-gray-400'>Course<span className='text-rred'>*</span></label>
                        <input type="text" name='course' className='input-field' placeholder='Course' value={formData.course} onChange={handleInputChange} />
                        {studentEPValidationErrors.course && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentEPValidationErrors.course}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='level' className='text-[0.75rem] text-gray-400'>Level<span className='text-rred'>*</span></label>
                        <select name='level' className='input-field' value={formData.level} onChange={handleInputChange}>
                            <option value="" disabled>Select your level</option>
                            <option value="Year 1">Year 1</option>
                            <option value="Year 2">Year 2</option>
                            <option value="Year 3">Year 3</option>
                            <option value="Year 4">Final Year</option>
                            <option value="Outgoing">Outgoing</option>
                        </select>
                        {studentEPValidationErrors.level && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{studentEPValidationErrors.level}</p>}
                    </div></>}
                    <div className="w-full">
                        <label htmlFor='website' className='text-[0.75rem] text-gray-400'>Website</label>
                        <input type="text" name='website' className='input-field' placeholder='Website' value={formData.website} onChange={handleInputChange} />
                        {linksValidationErrors.website && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{linksValidationErrors.website}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='linkedin' className='text-[0.75rem] text-gray-400'>Linkedin</label>
                        <input type="text" name='linkedin' className='input-field' placeholder='Linkedin' value={formData.linkedin} onChange={handleInputChange} />
                        {linksValidationErrors.linkedin && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{linksValidationErrors.linkedin}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='github' className='text-[0.75rem] text-gray-400'>Github</label>
                        <input type="text" name='github' className='input-field' placeholder='Github' value={formData.github} onChange={handleInputChange} />
                        {linksValidationErrors.github && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{linksValidationErrors.github}</p>}
                    </div>
                    <button disabled={updatingProfile} type='submit' className='bg-pri hover:opacity-90 transition-all w-full p-2.5 rounded-[15px] text-sm font-bold text-white flex justify-center items-center h-10 cursor-pointer gap-1'>
                        {updatingProfile ? <Loader color='white' bgcolor='transparent' /> : "Continue"}
                        {!updatingProfile && <ArrowRight size={15} />}                    
                    </button>
                </form>
            </div>
            <BackBtn />
        </main>
        </>); }


export default EditProfile;