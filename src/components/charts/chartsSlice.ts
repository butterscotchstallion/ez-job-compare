import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/urls';
import { RootState } from '../../store';

export const chartsApi = createApi({
    reducerPath: 'chartsApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const token = (getState() as RootState)?.auth?.token;
            if (token) {
                headers.set('x-ezjobcompare-session-token', token);
            }
            headers.set('Content-Type', 'application/json');
            return headers
        },
    }),
    endpoints: (builder) => ({
        getKarmaByUser: builder.query<any, void>({
            query: () => `karmaSummary`,
            transformResponse: (response: any) => {
                if (response.status === 'ERROR') {
                    throw new Error(response.message);
                }
                return response.results;
            }
        }),
        getReviewsByEmployer: builder.query<any, void>({
            query: () => `employer/reviewCountList`,
            transformResponse: (response: any) => {
                return response.results;
            }
        })
    })
});

export const { 
    useGetKarmaByUserQuery, 
    useGetReviewsByEmployerQuery
} = chartsApi;