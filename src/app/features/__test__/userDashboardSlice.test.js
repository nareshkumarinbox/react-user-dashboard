import { serverUrls, message } from '../../constants';
import userDashboardReducer, { initialState, getPosts } from '../userDashboardSlice';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

const withUserPosts = [
    {id: 1, title: "title 1", body: "post body 1"}
]

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({posts: initialState});
jest.mock("axios");

describe('userDashboardSlice', () => {
    describe('reducers', () => {
        test('returns initial state', () => {
            const nextState = userDashboardReducer(undefined, {});
            expect(nextState).toStrictEqual(initialState);
        });
    });
});

describe('extra reducers', () => {
    it('getPosts.pending', () => {
        const nextState = userDashboardReducer(initialState, getPosts.pending());
        expect(nextState.userPosts).toStrictEqual(initialState.userPosts);
        expect(nextState.isLoading).toBeTruthy();
    });

    it('getPosts.fulfilled', () => {
        const mockAsyncPayload = withUserPosts;
        const nextState = userDashboardReducer(initialState, getPosts.fulfilled(mockAsyncPayload));
        expect(nextState.userPosts).toHaveLength(withUserPosts.length);
        expect(nextState.userPosts).toStrictEqual(withUserPosts);
        expect(nextState.isLoading).toBeFalsy();
    });

    it('getPosts.rejected', () => {
        const mockAsyncPayloadError = 'error message';
        const nextState = userDashboardReducer(initialState, getPosts.rejected(mockAsyncPayloadError));
        expect(nextState.userPosts).toHaveLength(0);
        expect(nextState.isLoading).toBeFalsy();
    });
});

describe('userDashboardSlice async', () => {
    test('getPosts with successfull data', () => {
        const resp = {data: withUserPosts};
        axios.get.mockResolvedValue(Promise.resolve(resp));
        const expectedActions = [
                getPosts.pending(),
                getPosts.fulfilled(Promise.resolve(resp))
            ]

        const thunk =  store.dispatch(getPosts())
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(
            serverUrls.GET_BLOG_URL
        );

        thunk.then(() => {
            const actions  = store.getActions();
            expect(actions).toContainEqual(expectedActions);
        });
    });
});
