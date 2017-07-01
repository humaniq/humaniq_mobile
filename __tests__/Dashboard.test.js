/**
 * Created by root on 6/28/17.
 */
import {shallow, mount} from 'enzyme'
import React, {Component} from 'react';
import DashboardConnected, {Dashboard} from '../src/components/Dashboard/Dashboard'
import configureMockStore from 'redux-mock-store'
const mockStore = configureMockStore()
import {connect} from 'react-redux';
import {Provider} from 'react-redux';
import store from '../src/utils/store'
import sinon from 'sinon'

/***
 * Testing Dashboard component
 ***/

describe('<Dashboard />', () => {

    /***
     * Testing Dashboard component separately from connected (Redux)
     ***/

    let user = {
        registered: true,
        id: 1,
        password: 'password',
        imei: 'imei',
        phone: '+123456789',
        token: 'token'
    }


    it('should render correctly all its Children', () => {
        const wrapper = shallow(<Dashboard user={user} store={store}/>)
        expect(wrapper.find('View').at(0).props().children.length).toBe(7)
    })

    it('should render correctly Dashboard', () => {
        const wrapper = shallow(<Dashboard user={user} store={store}/>)
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.length).toBe(1)
    })

    it("should render Dashboard ", () => {
        const wrapper = shallow(<Dashboard user={user} store={store}/>)
        expect(wrapper.find('Text').at(0).length).toEqual(1)
        expect(wrapper.find('Text').at(0).props().children).toEqual('DASHBOARD')
    })

    it("should render 'Existing user' ", () => {
        const wrapper = shallow(<Dashboard user={user} store={store}/>)
        expect(wrapper.find('Text').at(1).length).toEqual(1)
        expect(wrapper.find('Text').at(1).props().children).toEqual('EXISTING USER')
    })

    it("should render 'New user' ", () => {
        user.registered = false
        const wrapper = shallow(<Dashboard user={user} store={store}/>)
        expect(wrapper.find('Text').at(1).length).toEqual(1)
        expect(wrapper.find('Text').at(1).props().children).toEqual('NEW USER')
    })

    it("should render 'user id' ", () => {
        const wrapper = shallow(<Dashboard user={user} store={store}/>)
        expect(wrapper.find('Text').at(2).length).toEqual(1)
        expect(wrapper.find('Text').at(2).props().children).toEqual('user id: ' + user.id)
    })

    it("should render 'user password' ", () => {
        const wrapper = shallow(<Dashboard user={user} store={store}/>)
        expect(wrapper.find('Text').at(3).length).toEqual(1)
        expect(wrapper.find('Text').at(3).props().children).toEqual('user pass: ' + user.password)
    })

    /***
     * Testing Dashboard connected (Redux)
     ***/

    it("Dashboard should take props ", () => {
        const wrapper = shallow(<DashboardConnected store={store}/>)
        expect(wrapper.props().user).toEqual({})
    })

})