/**
 * Created by root on 6/28/17.
 */
import {shallow} from 'enzyme'
import React, { Component } from 'react';
import mockStore from 'redux-mock-store'

const store = mockStore()

describe('<Camera />', () => {
    // it('should render correctly', () => {
    //     const wrapper = shallow(<Camera store={store}/>)
    //     expect(wrapper.length).toBe(1)
    //     expect(wrapper).toMatchSnapshot()
    // })

    it('should', () => {
        expect(2).toBe(2)
    })
})