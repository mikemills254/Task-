import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Slicer";

export const store = configureStore({
    reducer: {
        auth: authReducer,
    }
})