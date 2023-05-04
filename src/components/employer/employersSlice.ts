import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/urls';
import { RootState } from '../../store';

export interface IJobMapListItem {
    employerName: string;
    employerId: number;
    jobCount: number;
};
export interface IJobCountMap {
    [employerId: number]: number;
};

export const employersApi: RootState = createApi({
    reducerPath: 'employersApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getEmployers: builder.query({
            query: () => `employers`
        }),
        getJobCounts: builder.query<any, void>({
            query: () => `employers/jobCount`,
            transformResponse: (response: any) => {
                return response.results;
            }
        }),
        getRecruiters: builder.query({
            query: () => `recruiters`
        })
    })
});

export const { 
    useGetEmployersQuery,
    useGetJobCountsQuery,
    useGetRecruitersQuery 
} = employersApi;