import type { Applications, Internship, User } from "../../utils/types";
import api from "../apiSlice";


const applicationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        internshipApplication: builder.mutation<{internship: Internship, student: User}, { studentId: string, internshipId: string }>({
            query: (body) => ({
                url: "/applications",
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Application" as const, id: "LIST" }],
        }),
        removeApplication: builder.mutation<{internship: Internship, student: User}, { body: {selected: string}, id: string }>({
            query: ({body, id}) => ({
                url: `/applications/${id}`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Application" as const, id: "LIST" }],
        }),
        shortlistApplicants: builder.mutation<{internship: Internship, student: User}, { body: {selected: string, datetime: string, type: string, location: string}, id: string }>({
            query: ({body, id}) => ({
                url: `/applications/shortlist/${id}`,
                method: "POST",
                body
            }),
            invalidatesTags:(_result, _error, args) =>  [{ type: "Application" as const, id: "LIST" }, { type: "Internship" as const, id: args.id }],
        }),
        getApplicationsByStudent: builder.query<Applications[], string>({
            query: (id) => `/applications/student/${id}`,
            providesTags: (result) => (result && result?.length > 0) ? [...result.map(application => ({ type: "Application" as const, id: application?.id })), { type: "Application" as const, id: "LIST" }] : [{ type: "Application" as const, id: "LIST" }]
        }),
        getApplicationsByInternship: builder.query<Applications[], string>({
            query: (id) => `/applications/internship/${id}`,
            providesTags: (result) => result ? [...result.map(application => ({ type: "Application" as const, id: application?.id })), { type: "Application" as const, id: "LIST" }] : [{ type: "Application" as const, id: "LIST" }]
        }),
    }),
});


export const { useInternshipApplicationMutation, useGetApplicationsByStudentQuery, useGetApplicationsByInternshipQuery, useRemoveApplicationMutation, useShortlistApplicantsMutation } = applicationApi;