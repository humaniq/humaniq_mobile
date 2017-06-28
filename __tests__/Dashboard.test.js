/**
 * Created by root on 6/28/17.
 */
import {shallow} from 'enzyme'
import React, { Component } from 'react';
import mockStore from 'redux-mock-store'
import Dashboard from '../src/components/Dashboard/Dashboard'

const store = mockStore()

describe('<Dashboard />', () => {
    it('should render correcly', () => {
        const wrapper = shallow(<Dashboard store={store}/>)
        expect(wrapper).toMatchSnapshot()
    })
})