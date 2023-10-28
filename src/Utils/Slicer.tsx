import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Define a type for your state
interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
}

const accessToken = Cookies.get('accessToken');
console.log('access token at slicer', accessToken);

const initialState: AuthState = {
    isAuthenticated: !!accessToken,
    accessToken: accessToken || null,
};

const AuthSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setIsAuthenticated: (state: AuthState, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setAccessToken: (state: AuthState, action: PayloadAction<string | null>) => {
            state.accessToken = action.payload;
            state.isAuthenticated = !!action.payload;
        },
    },
});

export const { setIsAuthenticated, setAccessToken } = AuthSlice.actions;
export const authReducer = AuthSlice.reducer;
