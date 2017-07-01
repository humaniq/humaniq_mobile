/**
 * Created by root on 6/28/17.
 */
import React from 'react';
import mockStore from 'redux-mock-store'
import CamConnected, {Cam} from '../src/components/Camera/Camera'
import store from '../src/utils/store'
import {shallow, render, mount} from 'enzyme'
import { connect } from 'react-redux';
import mockCamera from '../__mocks__/react-native-camera'
import {Provider} from 'react-redux'
import sinon from 'sinon'

/***
 * Testing Camera component
 ***/


let user = {
        registered: true,
        id: 1,
        password: 'password',
        imei: 'imei',
        phone: '+123456789',
        token: 'token'
    }

let navigation = {
    dispatch : jest.fn()
}

describe('<Camera />', () => {

    /***
     * Testing Camera component separately from connected (Redux)
     ***/

    let mockedStore = store

    it('should render Camera component correctly', () => {
        const wrapper = shallow(<Cam store={store} user={user}/>)
        expect(wrapper.length).toBe(1)
        expect(wrapper).toMatchSnapshot()
    })

    it('Must call function handleCameraClose after click', () => {
        const wrapper = shallow(<Cam store={store} user={user} navigation={navigation}/>)
        wrapper.find('TouchableOpacity').at(0).simulate('press')
        expect(navigation.dispatch).toBeCalled()
    })

    it('should render 3 parent views', () => {
        const wrapper = shallow(<Cam user={user} store={mockedStore} />)
        const container = wrapper.find('View').at(0)
        expect(container.props().children.length).toBe(3)
    })

    it('touchableOpacity width and height must be greater than 0', () => {
        const wrapper = shallow(<Cam user={user} store={mockedStore} />)
        const container = wrapper.find('TouchableOpacity').at(1)
        expect(container.props().style[0].width).toBeGreaterThan(0)
        expect(container.props().style[0].height).toBeGreaterThan(0)
    })

    it('initial imagePath and imageB64 must be equal to empty', () => {
        const wrapper = shallow(<Cam user={user} store={mockedStore} />)
        expect(wrapper.state().imagePath).toEqual('')
        expect(wrapper.state().imageB64).toEqual('')
    })

    it('should would', () => {
        const wrapper = shallow(<Cam user={user} store={mockedStore} />)
        expect(typeof wrapper.instance().handleCameraClose).toEqual('function')
    })


})