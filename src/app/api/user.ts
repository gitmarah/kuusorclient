import type { User } from "../../utils/types";
import api from "../apiSlice";


const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        updateProfile: builder.mutation<User, {body: FormData, id: string}>({
            query: ({body, id}) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: (result) => result ? [{ type: "User" as const, id: result.id }, { type: "User" as const, id: "LIST" }, { type: "Student" as const, id: "LIST" }] : [{ type: "User" as const, id: "LIST" }, { type: "Student" as const, id: "LIST" }]
        }),
        uploadResume: builder.mutation<User, {body: FormData, id: string}>({
            query: ({body, id}) => ({
                url: `/users/uploadresume/${id}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: (result) => result ? [{ type: "User" as const, id: result.id }, { type: "User" as const, id: "LIST" }, { type: "Student" as const, id: result.id }, { type: "Student" as const, id: "LIST" }] : [{ type: "User" as const, id: "LIST" }, { type: "Student" as const, id: "LIST" }]
        }),
        getUser: builder.query<User, string>({
            query: (id) => `/users/${id}`,
            providesTags: (result) => result ? [{ type: "User" as const, id: result.id }, { type: "User" as const, id: "LIST" }] : [{ type: "User" as const, id: "LIST" }]
        }),
        getStudents: builder.query<User[], null>({
            query: () => `/users/students`,
            providesTags: (result) => result ? [...result.map(student => ({ type: "Student" as const, id: student.id })), { type: "Student" as const, id: "LIST" }] : [{ type: "Student" as const, id: "LIST" }]
        }),
    }),
});


export const { useUpdateProfileMutation, useUploadResumeMutation, useGetUserQuery, useGetStudentsQuery } = userApi;