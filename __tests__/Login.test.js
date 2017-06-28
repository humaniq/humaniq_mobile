/**
 * Created by root on 6/28/17.
 */
import {shallow} from 'enzyme'
import React, { Component } from 'react';
import configureMockStore from 'redux-mock-store'
const mockStore = configureMockStore()

describe('<Login />', () => {
    const store = mockStore({})
    it('should render Keyboard correcly', () => {
        expect(1).toBe(1)
    })
})