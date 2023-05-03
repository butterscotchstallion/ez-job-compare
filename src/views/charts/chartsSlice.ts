import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/urls';

export const chartsApi = createApi({
    reducerPath: 'chartsApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder: any) => ({
        charts: builder.query({
            query: () => `employers`,
            transformResponse: (response: any) => {

            }
        })
    })
});

export const { useChartsQuery } = chartsApi;