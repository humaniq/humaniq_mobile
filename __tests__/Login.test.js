/**
 * Created by root on 6/28/17.
 */
import {shallow} from 'enzyme'
import React, { Component } from 'react';
import Keyboard from '../src/components/Login/Keyboard'
import CodeInput from '../src/components/Login/CodeInput'
import TelInput from '../src/components/Login/TelInput'
import configureMockStore from 'redux-mock-store'
const mockStore = configureMockStore()

describe('<Login />', () => {
    const store = mockStore({})
    it('should render Keyboard correcly', () => {
        const wrapper = shallow(<Keyboard/>)
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.length).toBe(1)
    })
})