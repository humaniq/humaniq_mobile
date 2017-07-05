/**
 * Created by root on 6/28/17.
 */
import {shallow, mount} from 'enzyme'
import React, {Component} from 'react';
import InstructionsConnected, {Instructions} from '../src/components/Instructions/Instructions'
import configureMockStore from 'redux-mock-store'
const mockStore = configureMockStore()
import {connect} from 'react-redux';
import {Provider} from 'react-redux';
import store from '../src/utils/store'
import sinon from 'sinon'

/***
 * Testing Instructions component
 ***/

describe('<Instructions />', () => {

    it('should render correctly all its Children', () => {
        // const wrapper = shallow(<Instructions store={store}/>)
        // expect(wrapper).toMatchSnapshot()
    })

})