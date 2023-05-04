import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/urls';

export const chartsApi = createApi({
    reducerPath: 'chartsApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getKarmaByUser: builder.query<any, void>({
            query: () => `karmaSummary`,
            transformResponse: (response: any) => {
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