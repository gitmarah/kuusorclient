import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials, setToken } from "../app/authSlice";
import { useAppDispatch } from "../app/hooks";
import { useGetUserAndAccessTokenQuery } from "../app/api/auth";
import Splash from "../components/Splash";

const GoogleOAuth: React.FC = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const params = new URLSearchParams(search);
    const token = params.get("token");

    
    useEffect(() => {
        if (token) {
            dispatch(setToken(token));
        }
    }, [dispatch, token]);

    
    const { data, isError } = useGetUserAndAccessTokenQuery(undefined, {
        skip: !token,
    });

    
    useEffect(() => {
        if (data) {
            dispatch(setCredentials(data));
            if(data.user.isNewUser) navigate(`/completeprofile`); else navigate("/");
        }
    }, [data, dispatch, navigate]);


    useEffect(() => {
        if (isError) {
            navigate("/signin");
        }
    }, [data, isError, navigate]);

    return <Splash/>;
};

export default GoogleOAuth;
