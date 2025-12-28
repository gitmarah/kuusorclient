import React from 'react';
import { useAppSelector } from '../app/hooks';
import { Navigate, Outlet } from 'react-router-dom';
import Splash from './Splash';

interface Props {
    allowedRoles: string[]
}

const ProtectedRoutes: React.FC<Props> = ({ allowedRoles }) => {
    const { token, isAuthLoading, user } = useAppSelector(state => state.auth);
    if(isAuthLoading) return <Splash />;
    if(!user?.role) return <Navigate to={"/signin"} replace />;
    return token && allowedRoles.includes(user?.role) ? <Outlet /> : <Navigate to={"/signin"} replace />
}

export default ProtectedRoutes;