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

    it('should render correctly Instruction', () => {
        const wrapper = shallow(<Instructions store={store}/>)
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.length).toBe(1)
    })

    it('should have initial states', () => {
        const wrapper = shallow(<Instructions store={store}/>)
        expect(wrapper.state()).toBeDefined()
    })

    it('initial state should be equal to expected', () => {
        let initialState = {
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            paused: false,
            progress: 0,
            source: '',
            loading: true,
            downloaded: true
        }
        const wrapper = shallow(<Instructions store={store}/>)
        expect(wrapper.state()).toEqual(initialState)
    })

    it('ActivityIndicator should render and animating in the beginning', () => {
        const expectedValue = true
        const wrapper = shallow(<Instructions store={store}/>)
        expect(wrapper.find('ActivityIndicator').first().props().animating).toEqual(expectedValue)
    })

    it('ActivityIndicator should stop animating after get data', () => {
        const wrapper = shallow(<Instructions store={store}/>)
        const expectedValue = false
        wrapper.setState({
            loading: false
        })
        expect(wrapper.find('ActivityIndicator').first().props().animating).toEqual(expectedValue)
    })

    it('onProgress() function should return progress value', () => {
        const expectedValue = 1
        const data = {
            currentTime: 9.20
        }
        const wrapper = shallow(<Instructions store={store}/>)
        expect(wrapper.state().progress).toBeDefined()
        expect(wrapper.state().progress).toEqual(0)

        wrapper.setState({
            duration: 9.20
        })
        wrapper.instance().onProgress(data) // simulating function call

        expect(wrapper.state().progress).toEqual(expectedValue)
    })

    it('should render Video component', () => {
        const wrapper = shallow(<Instructions store={store}/>)
        expect(wrapper.find('Video').first().length).toEqual(1)
    })

    it('should call onPressEnd() and resume video', () => {
        const expected = false
        const wrapper = shallow(<Instructions store={store}/>)
        const videoComponent = wrapper.find('Video').first()
        // first we should simulate pause event
        wrapper.instance().onPressStart()
        // then we will check if player paused
        expect(wrapper.state().paused).toEqual(true)
        // then we call on onPressEnd() function which will resume movie again
        wrapper.instance().onPressEnd()
        expect(wrapper.state().paused).toEqual(expected)
        expect(videoComponent.props().paused).toEqual(expected)
    })

    it('should call onLoad() and set Duration', () => {
        const mockData = {
            duration: 100
        }
        const wrapper = shallow(<Instructions store={store}/>)
        wrapper.instance().onLoad(mockData)
        expect(wrapper.state().duration).toEqual(mockData.duration)
    })

    it('should call onEnd() and stop video', () => {
        const wrapper = shallow(<Instructions store={store}/>)
        wrapper.instance().onEnd()
        expect(wrapper.state().paused).toEqual(true)
    })

    it('should call onClose() function', () => {
        const click = jest.fn()
        const navigation = {
            dispatch: click // spy
        }
        const wrapper = shallow(<Instructions store={store} navigation={navigation}/>)
        wrapper.instance().onClosePress()
        expect(click).toBeCalled()
    })

})