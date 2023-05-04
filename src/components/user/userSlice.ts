import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/urls';
import { RootState } from '../../store';

export const userApi: RootState = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getUserByToken:  builder.query({
            query: (token: string) => `users/${token}`
        }),
    })
});

export const { 
    useGetUserByTokenQuery,
} = userApi;