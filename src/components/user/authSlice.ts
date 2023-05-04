import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import IUser from "./i-user.interface";

type AuthState = {
    user: IUser | null
    token: string | null
};

const slice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null
    } as AuthState,
    reducers: {
        setCredentials: (
            state,
            { payload: { user, token } }: PayloadAction<{user: IUser; token: string}>
        ) => {
            state.user = user;
            state.token = token;
        }
    }
});

export const { setCredentials } = slice.actions;
export default slice.reducer;
export const selectCurrentUser = (state: RootState) => state?.auth?.user;