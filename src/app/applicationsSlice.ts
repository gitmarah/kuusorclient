import { createSlice } from "@reduxjs/toolkit";
import type { Applications } from "../utils/types";

interface InitialState {
    applications: Applications[];
    isLoadingApplications: boolean;
}

const initialState: InitialState = {
    applications: [],
    isLoadingApplications: true,
}

const applicationsSlice = createSlice({
    name: "applications",
    initialState,
    reducers: {
        setApplications: (state, { payload }) => {
            state.applications = payload;
            state.isLoadingApplications = false;
        }
    }
});

export const { setApplications } = applicationsSlice.actions;
export default applicationsSlice.reducer;