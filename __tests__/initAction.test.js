/**
 * Created by root on 6/27/17.
 */
/**
 * Created by root on 6/27/17.
 */
import React from 'react';
import {INIT_APP} from '../src/actions/types';
import initApp from '../src/actions/init'

/***
 * Testing actions
 ***/

describe('init Action', () => {
    it('should return action', () => {
        expect(
            initApp()
        ).toEqual({
            type: INIT_APP
        })
    })
})