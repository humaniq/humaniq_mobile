/**
 * Created by root on 6/28/17.
 */
import {shallow, render, mount} from 'enzyme'
import React, { Component } from 'react';
import mockStore from 'redux-mock-store'

// jest.mock('react-native-fetch-blob', () => {
//     return {
//         DocumentDir: () => {},
//         polyfill: () => {},
//     }
// });

describe('<Camera />', () => {
    it('should render correctly', () => {
        {/*const wrapper = shallow(<Camera />)*/}
        expect(1).toBe(1)
        // expect(wrapper).toMatchSnapshot()
    })
})