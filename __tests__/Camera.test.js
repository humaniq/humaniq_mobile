/**
 * Created by root on 6/28/17.
 */
import React from 'react';
import mockStore from 'redux-mock-store';
import CamConnected, { Cam } from '../src/components/Camera/Camera';
import store from '../src/utils/store';
import { shallow, render, mount } from 'enzyme';
import { connect } from 'react-redux';
import mockCamera from '../__mocks__/react-native-camera';
import { Provider } from 'react-redux';
import sinon from 'sinon';

/** *
 * Testing Camera component
 ** */


const user = {
  account: {
    payload: {
      code: 3003,
    },
    isFetching: false,
  },
  validate: {
    payload: {
      code: 3003,
    },
    isFetching: false,
  },
  faceEmotionCreate: {
    payload: {},
    isFetching: false,
  },
  faceEmotionValidate: {
    payload: {},
    isFetching: false,
  },
  photo: 'photo',
  registered: true,
  id: 1,
  password: 'password',
  imei: 'imei',
  phone: '+123456789',
  token: 'token',
  avatar: {
    b64: 'path',
    localPath: 'localPath',
  },
};

const navigation = {
  navigation: {
    navigate: jest.fn(),
    dispatch: jest.fn(),
  },
  state: {
    params: {
      user,
    },
  },
};

describe('<Camera />', () => {
    /** *
     * Testing Camera component separately from connected (Redux)
     ** */

  const mockedStore = store;
  //
  it('should render Camera component correctly', () => {
    const wrapper = shallow(<Cam store={store} user={user} navigation={navigation} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('Must call function handleCameraClose after click', () => {
    const navigation = {
      navigation: {
        navigate: jest.fn(),
        dispatch: jest.fn(),

      },
      dispatch: jest.fn(),
      state: {
        dispatch: jest.fn(),
        params: {
          user,
        },
      },
    };
    const wrapper = shallow(<Cam store={store} user={user} navigation={navigation} />);
    wrapper.find('TouchableOpacity').at(0).simulate('press');
    expect(navigation.dispatch).toBeCalled();
  });

  it('should render 5 parent views', () => {
    const wrapper = shallow(<Cam user={user} store={mockedStore} navigation={navigation} />);
    const container = wrapper.find('View').at(0);
    expect(container.props().children.length).toBe(5);
  });

  it('initial imagePath and imageB64 must be equal to empty', () => {
    const wrapper = shallow(<Cam user={user} store={mockedStore} navigation={navigation} />);
    expect(wrapper.state().path).toEqual('');
    expect(wrapper.state().error).toEqual(false);
    expect(wrapper.state().errorCode).toEqual(null);
    expect(wrapper.state().photoGoal).toEqual('isRegistered');
    expect(wrapper.state().requiredEmotions).toEqual([]);
  });

  it('should return type Function', () => {
    const wrapper = shallow(<Cam user={user} store={mockedStore} navigation={navigation} />);
    expect(typeof wrapper.instance().handleCameraClose).toEqual('function');
  });
});
