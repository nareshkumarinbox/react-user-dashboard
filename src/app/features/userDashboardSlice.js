import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"

import axios from "axios";
import {serverUrls} from "../../app/constants";

export const getPosts  = createAsyncThunk('posts/getPosts', async () => {
    return axios
            .get(serverUrls.GET_BLOG_URL)
            .then((response) => response.data);
})

export const initialState = {
    userPosts: [],
    isLoading: false
}

export const postsSlice = createSlice({
    name: "posts",
    initialState,
    extraReducers: {
        [getPosts.pending]: (state) => {
            state.isLoading = true;
        },
        [getPosts.fulfilled]: (state, {payload}) => {
            state.userPosts = payload;
            state.isLoading = false;
        },
        [getPosts.rejected] : (state, action) => {
            state.userPosts = [];
            state.isLoading = false;
        }
    }
})
export const selectIsLoading = (state) => state.posts.isLoading;
export const selectPosts = (state) => state.posts.userPosts;
export default postsSlice.reducer;