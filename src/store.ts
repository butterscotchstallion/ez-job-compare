import { configureStore } from '@reduxjs/toolkit'
import { employerApi } from './components/employer/employersSlice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

export const store: any = configureStore({
  reducer: {
    [employerApi.reducerPath]: employerApi.reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(employerApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);