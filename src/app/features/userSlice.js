import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"

import axios from "axios";
import {serverUrls, message} from "../../app/constants";

export const login  = createAsyncThunk(
    'user/login',
    async (details, { rejectWithValue }) => {
        if(!(details.userName && details.password)) {
            return rejectWithValue(message.LOGIN_EMPTY_FIELDS);
        }
        return axios
            .post(serverUrls.LOGIN_URL, details)
            .then((response) => response.data);
    }
)

export const initialState = {
    user: null,
    error: null
};
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
        },
        cleanLogInErrors: (state) => {
            state.user = null;
            state.error = null;
        }
    },
    extraReducers: {
        [login.pending]: (state) => {
            state.error = message.AUTH_LOADING;
        },
        [login.fulfilled]: (state, {payload}) => {
            state.user = payload;
            state.error = null;
        },
        [login.rejected] : (state, action) => {
            state.user = null;
            state.error = action.payload ? action.payload : action.error.message;
        }
    }
})

export const {setUserData, logout, cleanLogInErrors} = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectError = (state) => state.user.error;
export const selectIsUserLogedIn = (state) => state.user.user && state.user.user.userName ? true : false;
export default userSlice.reducer;