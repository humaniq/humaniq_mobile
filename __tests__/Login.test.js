/**
 * Created by root on 6/28/17.
 */
import {shallow} from 'enzyme'
import React, { Component } from 'react';
import configureMockStore from 'redux-mock-store'
import Keyboard from '../src/components/Login/Keyboard'
import PasswordConnected, {Password} from '../src/components/Login/Password'
import store from '../src/utils/store'
const mockStore = configureMockStore()

/***
 * Testing Login Components
 ***/

describe('<Login />', () => {

    /***
     * Testing Keyboard component
     ***/

    it('should render Keyboard correctly', () => {
        const wrapper = shallow(<Keyboard/>)
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.length).toBe(1)
    })

    it('should render parent View correctly', () => {
        const wrapper = shallow(<Keyboard/>)
        expect(wrapper.find('View').at(0).length).toBe(1)
    })

    it('should render all children correctly', () => {
        const wrapper = shallow(<Keyboard/>)
        expect(wrapper.find('View').at(0).children().length).toBe(4)
    })

    it('should call renderRow() function and return cells', () => {
        const wrapper = shallow(<Keyboard/>)
        expect(wrapper.instance().renderRow([1,2,3]).props.children[0].key).toEqual("1")
        expect(wrapper.instance().renderRow([1,2,3]).props.children[1].key).toEqual("2")
        expect(wrapper.instance().renderRow([1,2,3]).props.children[2].key).toEqual("3")
    })

    it('should call renderCell() function and render text', () => {
        const number = 2
        const wrapper = shallow(<Keyboard/>)
        expect(wrapper.instance().renderCell(number).props.children.props.children).toBe(number)
    })

    it('renderCell() should return TouchableOpacity', () => {
        const number = 2
        const wrapper = shallow(<Keyboard/>)
        expect(wrapper.instance().renderCell(number).type.displayName).toEqual('TouchableOpacity')
    })

    it('should call onNumberPress() function via props', () => {
        const number = 1
        const onClick = jest.fn()
        const wrapper = shallow(<Keyboard onNumberPress={onClick}/>)
        wrapper.instance().renderCell(number).props.onPress() // simulate click
        expect(onClick).toBeCalled()
    })

    it('should call onBackspacePress() function via props', () => {
        const onClick = jest.fn()
        const wrapper = shallow(<Keyboard onBackspacePress={onClick}/>)
        wrapper.instance().renderBackspace().props.onPress() // simulate click
        expect(onClick).toBeCalled()
    })

    it('renderBackspace should return Back text', () => {
        const expectedText = "back"
        const wrapper = shallow(<Keyboard />)
        expect(wrapper.instance().renderBackspace().props.children.props.children).toEqual(expectedText)
    })

    it('should call renderHelp() and return Image component', () => {
        const wrapper = shallow(<Keyboard/>)
        expect(wrapper.instance().renderHelp().props.children.props.source).toBeDefined()
    })

    it('should call onHelpPress() function via props', () => {
        const onClick = jest.fn()
        const wrapper = shallow(<Keyboard onHelpPress={onClick}/>)
        wrapper.instance().renderHelp().props.onPress() // simulate click
        expect(onClick).toBeCalled()
    })

    /***
     * Testing Keyboard component
     ***/

    let user = {
        registered: true,
        id: 1,
        password: 'password',
        imei: 'imei',
        phone: '+123456789',
        token: 'token',
        avatar: {
            b64: 'path',
            localPath: 'localPath'
        }
    }

    let navigation = {
        dispatch : jest.fn(),
        state: {
            params: jest.fn()
        }
    }

    it('should render Keyboard correctly', () => {
        const wrapper = shallow(<Password store={store} user={user} navigation={navigation}/>)
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.length).toBe(1)
    })
})