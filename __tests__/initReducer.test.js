/**
 * Created by root on 6/27/17.
 */
import React from 'react';
import reducer from '../src/reducers/init'
import {INIT_APP} from '../src/actions/types';

/***
 * Testing reducers
***/

describe('Init reducer', () => {
    const defaultState = true
    const expectedState = false
    it('can handle action', () => {
        expect(reducer(defaultState, {
            type: INIT_APP
        })).toBe(expectedState)
    })

    it('should return default state', () => {
        let defaultState = false
        let testAction = {
            type: 'TEST'
        }
        expect(reducer(undefined,
            testAction
        )).toBe(defaultState)
    })
})