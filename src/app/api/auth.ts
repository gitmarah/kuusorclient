import type { SigninFormData, SigninReturnType, SignupFormData } from "../../utils/types";
import api from "../apiSlice";


const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation<SigninReturnType, SigninFormData>({
            query: (body) => ({
                url: "/auth",
                method: "POST",
                body
            }),
            invalidatesTags: [{type: "Student" as const, id: "LIST"}, {type: "Application" as const, id: "LIST"}, {type: "Internship" as const, id: "LIST"}, {type: "User" as const, id: "LIST"}]
        }),
        signUp: builder.mutation<{ message: string }, SignupFormData>({
            query: (body) => ({
                url: "/signup",
                method: "POST",
                body
            }),
        }),
        signOut: builder.mutation<{ message: string }, null>({
            query: () => ({
                url: "/auth/signout",
                method: "POST",
                body: {}
            }),
        }),
        verifyEmail: builder.query({
            query: (token) => `/auth/verify/${token}`,
        }),
        getUserAndAccessToken: builder.query({
            query: () => `/auth/getuserandaccesstoken`,
        }),
        forgotPassword: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: "/auth/forgotpassword",
                method: "POST",
                body,
            }),
        }),
        resetPassword: builder.mutation<{ message: string }, { password: string, token: string }>({
            query: (body) => ({
                url: "/auth/resetpassword",
                method: "POST",
                body,
            }),
        }),
    }),
});


export const { useSignInMutation, useSignUpMutation, useSignOutMutation, useVerifyEmailQuery, useForgotPasswordMutation, useResetPasswordMutation, useGetUserAndAccessTokenQuery } = authApi;