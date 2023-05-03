import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/urls';

export const employerApi = createApi({
    reducerPath: 'employerApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder: any) => ({
        fetchAll: builder.query({
            query: () => `employees`,
            transformResponse: (response: any) => {
                
            }
        }),
    })
});

export const { useFetchAllQuery } = employerApi;