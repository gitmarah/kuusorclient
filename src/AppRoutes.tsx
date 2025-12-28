import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoutes from './components/ProtectedRoutes';
import Home from './pages/Home';
import VerifyEmail from './pages/VerifyEmail';
import GoogleOAuth from './pages/GoogleOAuth';
import CompleteProfile from './pages/CompleteProfile';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import PostInternship from './pages/PostInternship';
import InternshipPage from './pages/InternshipPage';
import EditInternship from './pages/EditInternship';
import Students from './pages/Students';
import { useAppSelector } from './app/hooks';
import { useGetApplicationsByStudentQuery } from './app/api/application';
import { skipToken } from '@reduxjs/toolkit/query';
import { useDispatch } from 'react-redux';
import { setApplications } from './app/applicationsSlice';
import Applications from './pages/Applications';
import Applicants from './pages/Applicants';

const AppRoutes: React.FC = () => {

    const dispatch = useDispatch();
    const user = useAppSelector(state => state.auth.user);
    const { data: applications } = useGetApplicationsByStudentQuery(user?.studentId ?? skipToken)
    useEffect(() => {
        if(applications) dispatch(setApplications(applications));
        else dispatch(setApplications([]))
    }, [applications, dispatch]);

    return (
        <Router>
            <Routes>
                <Route path='/signin' element={<Signin />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/forgotpassword' element={<ForgotPassword />} />
                <Route path='/resetpassword' element={<ResetPassword />} />
                <Route path='/verifyemail' element={<VerifyEmail />} />
                <Route path='/googleoauth' element={<GoogleOAuth />} />
                <Route path='/' element={<Home />} />
                <Route path='/students' element={<Students />} />
                <Route element={<ProtectedRoutes allowedRoles={["STUDENT", "COMPANY"]} />}>
                    <Route path='/completeprofile' element={<CompleteProfile />} />
                    <Route path='/internship/:id' element={<InternshipPage />} />
                    <Route path='/applications' element={<Applications />} />
                    <Route path='/profile/:id' element={<UserProfile />} />
                    <Route path='/editprofile' element={<EditProfile />} />
                </Route>
                <Route element={<ProtectedRoutes allowedRoles={["COMPANY"]} />}>
                    <Route path='/postinternship' element={<PostInternship />} />
                    <Route path='/editinternship/:id' element={<EditInternship />} />
                    <Route path='/applicants/:id' element={<Applicants />} />
                </Route>
                <Route element={<ProtectedRoutes allowedRoles={["STUDENT"]} />}>
                    <Route path='/applications' element={<Applications />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default AppRoutes;