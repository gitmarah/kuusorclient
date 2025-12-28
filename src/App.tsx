import React, { useEffect } from "react";
import AppRoutes from "./AppRoutes";
import { fetchBaseQuery, type BaseQueryApi } from "@reduxjs/toolkit/query";
import { useAppDispatch } from "./app/hooks";
import { clearCredentials, setCredentials } from "./app/authSlice";

const App: React.FC = () => {

  const dispatch = useAppDispatch();

  useEffect(() => {
    const baseQuery = fetchBaseQuery({
      baseUrl: "http://localhost:4321/api/v1",
      credentials: "include",
    });
    const refreshApp = async() => {
      const refreshResult = await baseQuery("/auth/refresh", {} as BaseQueryApi, {});
      if(refreshResult.data) {
        dispatch(setCredentials(refreshResult.data));
      }else {
        await baseQuery("/auth/signout", {} as BaseQueryApi, {});
        dispatch(clearCredentials());
      }
    }
    
    refreshApp();

  }, []);

  return (
    <AppRoutes />
  );
}

export default App;
