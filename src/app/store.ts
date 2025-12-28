import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import applicationsReducer from "./applicationsSlice";
import api from "./apiSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        applications: applicationsReducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;