import type { Internship, PostInternshipFormData } from "../../utils/types";
import api from "../apiSlice";


const internshipApi = api.injectEndpoints({
    endpoints: (builder) => ({
        postInternship: builder.mutation<Internship, PostInternshipFormData>({
            query: (body) => ({
                url: '/internships',
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Internship" as const, id: "LIST" }]
        }),
        updateInternship: builder.mutation<Internship, {body: PostInternshipFormData, id: string}>({
            query: ({body, id}) => ({
                url: `/internships/${id}`,
                method: "PATCH",
                body
            }),
           invalidatesTags: (result) => result ? [{ type: "Internship" as const, id: result.id }, { type: "Internship" as const, id: "LIST" }] : [{ type: "Internship" as const, id: "LIST" }]
        }),
        deleteInternship: builder.mutation<Internship, string>({
            query: (id) => ({
                url: `/internships/${id}`,
                method: "DELETE",
            }),
           invalidatesTags: (result) => result ? [{ type: "Internship" as const, id: result.id }, { type: "Internship" as const, id: "LIST" }] : [{ type: "Internship" as const, id: "LIST" }]
        }),
        getInternship: builder.query<Internship, string>({
            query: (id) => `/internships/${id}`,
            providesTags: (result) => result ? [{ type: "Internship" as const, id: result.id }, { type: "Internship" as const, id: "LIST" }] : [{ type: "Internship" as const, id: "LIST" }]
        }),
        getInternshipsByCompany: builder.query<Internship[], string>({
            query: (id) => `/internships/company/${id}`,
            providesTags: (result) => result ? [...result.map(internship => ({ type: "Internship" as const, id: internship.id })), { type: "Internship" as const, id: "LIST" }] : [{ type: "Internship" as const, id: "LIST" }]
        }),
        getInternships: builder.query<Internship[], null>({
            query: () => `/internships`,
            providesTags: (result) => result ? [...result.map(internship => ({ type: "Internship" as const, id: internship.id })), { type: "Internship" as const, id: "LIST" }] : [{ type: "Internship" as const, id: "LIST" }]
        }),
    }),
});


export const { usePostInternshipMutation, useUpdateInternshipMutation, useGetInternshipQuery, useGetInternshipsByCompanyQuery, useGetInternshipsQuery, useDeleteInternshipMutation } = internshipApi;