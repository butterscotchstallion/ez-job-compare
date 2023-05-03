import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/urls';

export interface IJobMapListItem {
    employerName: string;
    employerId: number;
    jobCount: number;
};
export interface IJobCountMap {
    [employerId: number]: number;
};

export const employersApi = createApi({
    reducerPath: 'employersApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder: any) => ({
        getEmployers: builder.query({
            query: () => `employers`
        }),
        getJobCounts: builder.query({
            query: () => `employers/jobCount`,
            transformResponse: (response: any) => {
                const jobMap: IJobCountMap = {};
                const jobMapList = response.data.results;
                jobMapList.map((item: IJobMapListItem) => {
                    return jobMap[item.employerId] = item.jobCount;
                });
                return jobMap;
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