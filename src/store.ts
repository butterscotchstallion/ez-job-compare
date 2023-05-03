import { configureStore } from '@reduxjs/toolkit'
import { employersApi } from './components/employer/employersSlice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { tagsApi } from './components/tag/tagsSlice';
import { jobsApi } from './components/job/jobSlice';

export const store: any = configureStore({
  reducer: {
    [employersApi.reducerPath]: employersApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(employersApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);