import { configureStore } from '@reduxjs/toolkit';
import { chartsApi } from './components/charts/chartsSlice';
import { employersApi } from './components/employer/employersSlice';
import { jobsApi } from './components/job/jobSlice';
import { tagsApi } from './components/tag/tagsSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store: any = configureStore({
  reducer: {
    [employersApi.reducerPath]: employersApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    [chartsApi.reducerPath]: chartsApi.reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat([
      employersApi.middleware,
      chartsApi.middleware,
    ])
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);