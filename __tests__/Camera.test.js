/**
 * Created by root on 6/28/17.
 */
import {shallow, render, mount} from 'enzyme'
import React, { Component } from 'react';
import mockStore from 'redux-mock-store'
import Camera from '../src/components/Camera/Camera'

const store = mockStore()

jest.mock('react-native-fetch-blob', () => {
    return {
        DocumentDir: () => {},
        polyfill: () => {},
    }
});

describe('<Camera />', () => {
    it('should render correctly', () => {
        const wrapper = shallow(<Camera />)
        expect(wrapper.length).toBe(1)
        expect(wrapper).toMatchSnapshot()
    })
})