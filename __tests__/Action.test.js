/**
 * Created by root on 6/27/17.
 */
/**
 * Created by root on 6/27/17.
 */
import React from 'react';
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
import initApp from '../src/actions/init'
import {
    saveUserId,
    saveUserImei,
    saveUserPassword,
    saveUserPhone,
    saveUserToken,
    setAvatarPath,
    updateUserRegStatus
} from '../src/actions/user'

/***
 * Testing actions
 ***/

describe('init Action', () => {
    it('should return INIT action', () => {
        expect(initApp()).toEqual({
            type: INIT_APP
        })
    })

    it('should return updateRegistrationStatus action', () => {
        let status = "isRegistered"
        let expectedAction = {
            type: UPDATE_REGISTRATION_STATUS,
            status
        }
        expect(
            updateUserRegStatus(status)
        ).toEqual(expectedAction)
    })

    it('should return setAvatarPath action', () => {
        let path = "//some path"
        let expectedAction = {
            type: SET_AVATAR_PATH,
            path
        }
        expect(
            setAvatarPath(path)
        ).toEqual(expectedAction)
    })

    it('should return setAvatarPath action', () => {
        let id = 100
        let expectedAction = {
            type: SAVE_USER_ID,
            id
        }
        expect(
            saveUserId(id)
        ).toEqual(expectedAction)
    })

    it('should return saveUserImei action', () => {
        let imei = "900011229292"
        let expectedAction = {
            type: SAVE_USER_IMEI,
            imei
        }
        expect(
            saveUserImei(imei)
        ).toEqual(expectedAction)
    })

    it('should return saveUserPassword action', () => {
        let password = "some_password"
        let expectedAction = {
            type: SAVE_USER_PASSWORD,
            password
        }
        expect(
            saveUserPassword(password)
        ).toEqual(expectedAction)
    })

    it('should return saveUserPhone action', () => {
        let phone = "some_password"
        let expectedAction = {
            type: SAVE_USER_PHONE,
            phone
        }
        expect(
            saveUserPhone(phone)
        ).toEqual(expectedAction)
    })

    it('should return saveUserToken action', () => {
        let token = "some_token"
        let expectedAction = {
            type: SAVE_USER_TOKEN,
            token
        }
        expect(
            saveUserToken(token)
        ).toEqual(expectedAction)
    })
})