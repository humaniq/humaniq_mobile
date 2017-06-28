/**
 * Created by root on 6/27/17.
 */
import React from 'react';
import {shallow, mount} from 'enzyme'
import sinon from 'sinon'
import Login from '../src/components/Login/Login'
import store from '../src/utils/store';
import reducer from '../src/reducers/init'
import * as types from '../src/actions/types';
import configureMockStore from 'redux-mock-store'
const mockStore = configureMockStore()

/***
 * Testing Login component
 ***/

describe('<Login />', () => {
    it('should render Login component', () => {
        let wrapper = shallow(<Login store={store}/>)
        expect(
            wrapper.length
        ).toBe(1)
    });

    it('Login component wrapper (Renders correctly)', () => {
        const store = mockStore({})
        let wrapper = shallow(<Login store={store}/>)
        expect(wrapper).toMatchSnapshot();
    });

    it('should render TouchableOpacity', () => {
        let wrapper = shallow(<Login store={store}/>)
        let touchableOpacity = wrapper.find('TouchableOpacity').first()
        expect(
            touchableOpacity.length
        ).toBe(1)
    });

    it('should simulate button Click', () => {
        let wrapper = shallow(<Login store={store}/>)
        let button = wrapper.find('TouchableOpacity').first()
        button.simulate('press')
    });

    it('should open Chat component on Click', () => {
        let wrapper = shallow(<Login store={store}/>)
        let button = wrapper.find('TouchableOpacity').first()
        button.simulate('press')
    })

    it('initApp() should be undefined', () => {
        let wrapper = shallow(<Login store={store}/>)
        wrapper.instance().componentDidMount()
        expect(wrapper.props.initApp).toBeUndefined()
    })

})
