import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/urls';

export const tagsApi = createApi({
    reducerPath: 'tagsApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        fetchAll: builder.query({
            query: () => `tags`,
            transformResponse: (response: any) => {

            }
        }),
    })
});

export const { useFetchAllQuery } = tagsApi;