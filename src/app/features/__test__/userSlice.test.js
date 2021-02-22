import { serverUrls, message } from '../../constants';
import userReducer, { initialState, login, logout, cleanLogInErrors, selectIsUserLogedIn} from '../userSlice';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

const withDataState = {
    user: {userName: "test", password: "test"},
    error: "msg"
};
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({user: initialState});
jest.mock("axios");

describe('userSlice', () => {
    describe('reducers', () => {
        test('returns initial state', () => {
            const nextState = userReducer(undefined, {});
            expect(nextState).toBe(initialState);
            const state = mockStore({user: nextState}).getState();
            expect(selectIsUserLogedIn(state)).toBeFalsy();
        });

        test('logout', () => {
            const nextState = userReducer(withDataState, logout());
            expect(nextState.user).toBeNull();
            expect(nextState.error).toEqual("msg");
            const state = mockStore({user: nextState}).getState();
            expect(selectIsUserLogedIn(state)).toBeFalsy();
        });
        test('cleanLogInErrors', () => {
            const nextState = userReducer(withDataState, cleanLogInErrors());
            expect(nextState.user).toBeNull();
            expect(nextState.error).toBeNull();
            const state = mockStore({user: nextState}).getState();
            expect(selectIsUserLogedIn(state)).toBeFalsy();
        });
    });
});

describe('extra reducers', () => {
    test('login.pending', () => {
        const nextState = userReducer(initialState, login.pending());
        expect(nextState.user).toBe(initialState.user);
        expect(nextState.error).toBe(message.AUTH_LOADING);
        const state = mockStore({user: nextState}).getState();
        expect(selectIsUserLogedIn(state)).toBeFalsy();
    });

    test('login.fulfilled', () => {
        const mockAsyncPayload = withDataState.user;
        const nextState = userReducer(initialState, login.fulfilled(mockAsyncPayload));
        expect(nextState.user).toBe(withDataState.user);
        expect(nextState.error).toBeNull();
        const state = mockStore({user: nextState}).getState();
        expect(selectIsUserLogedIn(state)).toBeTruthy();
    });

    test('login.rejected', () => {
        const mockAsyncPayloadError = 'error message';
        const nextState = userReducer(initialState, login.rejected(mockAsyncPayloadError));
        expect(nextState.user).toBeNull();
        expect(nextState.error).toBe(mockAsyncPayloadError);
        const state = mockStore({user: nextState}).getState();
        expect(selectIsUserLogedIn(state)).toBeFalsy();
    });
});

describe('login async', () => {
    test('login without data', () => {
        const resp = {data: withDataState.user};
        axios.post.mockResolvedValue(Promise.resolve(resp));
        // const expectedActions = [
        //         login.pending(),
        //         login.rejected(message.LOGIN_EMPTY_FIELDS)
        //     ]

        const thunk = store.dispatch(login({}))
        expect(axios.get).toHaveBeenCalledTimes(0);
        // thunk.then(() => {
        //     const actions  = store.getActions();
        //     expect(actions).toContainEqual(expectedActions);
        // });
    });

    test('login with empty data', () => {
        const resp = {data: withDataState.user};
        axios.post.mockResolvedValue(Promise.resolve(resp));
        const expectedActions = [
                login.pending(),
                login.rejected(message.LOGIN_EMPTY_FIELDS)
            ]

        const thunk = store.dispatch(login({userName: "", password:""}))
        expect(axios.get).toHaveBeenCalledTimes(0);

        // thunk.then(() => {
        //     const actions  = store.getActions();
        //     expect(actions).toContainEqual(expectedActions);
        // });
    });
    

    test('login with successfull data', () => {
        const resp = {data: withDataState.user};
        axios.post.mockResolvedValue(Promise.resolve(resp));
        const expectedActions = [
                login.pending(),
                login.fulfilled(Promise.resolve(resp))
            ]

        const thunk = store.dispatch(login(withDataState.user))

        expect(axios.post).toHaveBeenCalledWith(
            serverUrls.LOGIN_URL,
            withDataState.user
        );

        // thunk.then(() => {
        //     const actions  = store.getActions();
        //     expect(actions).toContainEqual(expectedActions);
        // });
    });
});
