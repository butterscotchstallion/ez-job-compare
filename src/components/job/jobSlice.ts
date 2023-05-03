import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/urls';

export const jobsApi = createApi({
    reducerPath: 'jobsApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder: any) => ({
        fetchAll: builder.query({
            query: () => `jobs`
        })
    })
});

export const { useFetchAllQuery } = jobsApi;