/**
 * Created by root on 6/27/17.
 */
import React from 'react';
import {init} from '../src/reducers/init'
import {avatar} from '../src/reducers/avatar'
import {user} from '../src/reducers/user'

import {
    INIT_APP,
    SET_AVATAR_PATH,
    UPDATE_REGISTRATION_STATUS,
    SAVE_USER_ID,
    SAVE_USER_IMEI,
    SAVE_USER_PASSWORD,
    SAVE_USER_PHONE,
    SAVE_USER_TOKEN
} from '../src/actions/types';

/***
 * Testing reducers
 ***/

describe('REDUCERS TEST', () => {

    /***
     * Testing InitReducer
     ***/

    it('InitReducer can handle action', () => {
        const defaultState = true
        const expectedState = false
        expect(init(defaultState, {
            type: INIT_APP
        })).toBe(expectedState)
    })

    it('InitReducer should return default state', () => {
        const defaultState = false
        const testAction = {
            type: 'TEST'
        }
        expect(init(undefined,
            testAction
        )).toBe(defaultState)
    })

    it('InitReducer should return NULL', () => {
        expect(
            init(null, {})
        ).toBeNull()
    })

    /***
     * Testing AvatarReducer
     ***/

    it('AvatarReducer can handle action', () => {
        const path = 'test_path'
        const defaultState = {
            path: 'default_path'
        }
        const action = {
            type: SET_AVATAR_PATH,
            path
        }
        expect(
            avatar(defaultState, action)
        ).toEqual({
            path
        })
    })

    it('AvatarReducer should return default state', () => {
        const action = {
            type: "TEST_CONSTANT",
            path: "TEST_PATH"
        }
        expect(
            avatar({path: 'default_path'}, action)
        ).toEqual({path: 'default_path'})
    })

    it('AvatarReducer should return NULL', () => {
        expect(
            avatar(null, {})
        ).toBeNull()
    })

    /***
     * Testing UserReducer
     ***/

    it('UserReducer should handle REGISTRATION_STATUS ACTION', () => {
        const state = {
            registered: "isRegistered"
        }
        const action = {
            type: UPDATE_REGISTRATION_STATUS,
            status: "NotRegistered"
        }
        expect(
            user(state, action)
        ).toEqual({
            ...state,
            registered: action.status
        })
    })

    it('UserReducer should handle SET_AVATAR_PATH ACTION', () => {
        const state = {
            avatar: "old_path_to_avatar"
        }
        const action = {
            type: SET_AVATAR_PATH,
            path: "new_path_to_avatar"
        }
        expect(
            user(state, action)
        ).toEqual({
            ...state,
            avatar: action.path
        })
    })

    it('UserReducer should handle SAVE_USER_ID ACTION', () => {
        const state = {
            id: 11
        }
        const action = {
            type: SAVE_USER_ID,
            id: 121
        }
        expect(
            user(state, action)
        ).toEqual({
            ...state,
            id: action.id
        })
    })

    it('UserReducer should handle SAVE_USER_IMEI ACTION', () => {
        const state = {
            imei: "OLD_IMEI_CODE"
        }
        const action = {
            type: SAVE_USER_IMEI,
            imei: "NEW_IMEI_CODE"
        }
        expect(
            user(state, action)
        ).toEqual({
            ...state,
            imei: action.imei
        })
    })

    it('UserReducer should handle SAVE_USER_PASSWORD ACTION', () => {
        const state = {
            password: "OLD_USER_PASSWORD"
        }
        const action = {
            type: SAVE_USER_PASSWORD,
            password: "NEW_USER_PASSWORD"
        }
        expect(
            user(state, action)
        ).toEqual({
            ...state,
            password: action.password
        })
    })

    it('UserReducer should handle SAVE_USER_PHONE ACTION', () => {
        const state = {
            phone: "+998977200388"
        }
        const action = {
            type: SAVE_USER_PHONE,
            phone: "+998901443407"
        }
        expect(
            user(state, action)
        ).toEqual({
            ...state,
            phone: action.phone
        })
    })

    it('UserReducer should handle SAVE_USER_TOKEN ACTION', () => {
        const state = {
            token: "OLD_USER_TOKEN"
        }
        const action = {
            type: SAVE_USER_TOKEN,
            token: "NEW_USER_TOKEN"
        }
        expect(
            user(state, action)
        ).toEqual({
            ...state,
            token: action.token
        })
    })

    it('UserReducer should return NULL', () => {
        expect(
            user(null, {})
        ).toBeNull()
    })
})