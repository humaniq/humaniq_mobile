import { shallow } from 'enzyme';
import React, { Component } from 'react';
import { Text } from 'react-native';
import configureMockStore from 'redux-mock-store';
import ProfileConnected, { Profile } from '../src/components/Profile/Profile';
import ProfileSettingsConnected, { ProfileSettings } from '../src/components/Profile/ProfileSettings';
import ProfileEditConnected, { ProfileEdit } from '../src/components/Profile/ProfileEdit';
import store from '../src/utils/store';

const mockStore = configureMockStore();


/** *
 * Testing Profile Components
 ** */

const user = {
  id: '1568161709003113564',
  pic: 'http://www.gstatic.com/webp/gallery/2.jpg',
  balance: {
    token: {
      currency: '',
      amount: '',
    },
    price: {
      currency: '',
      amount: '',
    },
  },
  phone: '+1 (234) 567-8901',
  status: 1, // 1 - online, 0 - offline
  wallet: '0x123123123123',
};

const user2 = {
  person: {
    first_name: 'User',
    last_name: 'User1',
  },
  avatar: {
    url: 'http://www.gstatic.com/webp/gallery/2.jpg',
  },
  phone_number: {
    country_code: '998',
    phone_number: '901443407',
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
      user2,
    },
  },
};

describe('<Profile />', () => {
  /** *
   * Testing Profile Component
   ** */
  test('should render correctly', () => {
    const component = shallow(<Profile navigation={navigation} store={store} profile={user2} />);
    expect(component).toMatchSnapshot();
    expect(component.length).toBe(1);
  });

  test('should handle initial states', () => {
    const component = shallow(<Profile navigation={navigation} store={store} profile={user2} />);
    expect(component.state().item).toEqual({});
    expect(component.state().user).toBeDefined();
    expect(component.state().transactions).toEqual([]);
  });

  test('should call getAnimationType() and return animationObject', () => {
    const component = shallow(<Profile navigation={navigation} store={store} profile={user2} />);
    expect(component.instance().getAnimationType('header_translate')).toBeDefined();
  });

  test('should call getAnimationType() and return empty', () => {
    const empty = '';
    const component = shallow(<Profile navigation={navigation} store={store} profile={user2} />);
    expect(component.instance().getAnimationType()).toEqual(empty);
  });

  test('should render StatusBar with backgroundColor', () => {
    expectedBackgroundColor = '#598FBA';
    const component = shallow(<Profile navigation={navigation} store={store} profile={user2} />);
    const statusBar = component.find('StatusBar').at(0);
    expect(statusBar).toBeDefined();
    expect(statusBar.props().backgroundColor).toEqual(expectedBackgroundColor);
  });

  test('renderContent() should render Animated.ScrollView', () => {
    const component = shallow(<Profile navigation={navigation} store={store} profile={user2} />);
    const scrollView = component.instance().renderContent();
    expect(scrollView).toBeDefined();
  });

  test('should call and render empty view', () => {
    const component = shallow(<Profile navigation={navigation} store={store} profile={user2} />);
    const emptyView = component.instance().renderEmptyView();
    expect(emptyView.props.children.props.children.props.source).toEqual(1);
    expect(emptyView).toBeDefined();
  });

  test('should call onItemClick() function and set state', () => {
    const component = shallow(<Profile navigation={navigation} store={store} profile={user2} />);
    component.instance().onItemClick({});
    expect(component.state().modalVisibility).toEqual(true);
  });

  test('should call onChatClick() function and set state', () => {
    const component = shallow(<Profile navigation={navigation} store={store} profile={user2} />);
    component.instance().onChatClick();
    expect(component.state().modalVisibility).toEqual(false);
  });

    /** *
     * Testing ProfileSettings Component
     ** */

  const password = 'pass';

  test('ProfileSettings component should render correctly', () => {
    const component = shallow(<ProfileSettings navigation={navigation} store={store} profile={user2} password={password} />);
    expect(component).toMatchSnapshot();
    expect(component.length).toBe(1);
  });

  test('ProfileSettings component should handle initial states', () => {
    const user = {
      status: 1, // 1 - online, 0 - offline
    };
    const component = shallow(<Profile navigation={navigation} store={store} profile={user2} password={password} />);
    expect(component.state().modalVisibility).toEqual(false);
    expect(component.state().user).toEqual(user);
  });

  test('ProfileSettings should call getAnimationType() and return animationObject', () => {
    const component = shallow(<ProfileSettings navigation={navigation} store={store} profile={user2} password={password} />);
    expect(component.instance().getAnimationType('header_translate')).toBeDefined();
  });

  test('ProfileSettings should call getAnimationType() and return empty', () => {
    const empty = '';
    const component = shallow(<ProfileSettings navigation={navigation} store={store} profile={user2} password={password} />);
    expect(component.instance().getAnimationType()).toEqual(empty);
  });

  test('ProfileSettings should render StatusBar with backgroundColor', () => {
    expectedBackgroundColor = '#598FBA';
    const component = shallow(<ProfileSettings navigation={navigation} store={store} profile={user2} password={password} />);
    const statusBar = component.find('StatusBar').at(0);
    expect(statusBar).toBeDefined();
    expect(statusBar.props().backgroundColor).toEqual(expectedBackgroundColor);
  });

  test('ProfileSettings should call renderScrollViewComponent() method', () => {
    const component = shallow(<ProfileSettings navigation={navigation} store={store} profile={user2} password={password} />);
    expect(component.instance().renderScrollViewContent()).toBeDefined();
    expect(component.instance().renderScrollViewContent().props.children.length).toBe(3);
  });

  test('ProfileSettings should call renderContent() method', () => {
    const component = shallow(<ProfileSettings navigation={navigation} store={store} profile={user2} password={password} />);
    expect(component.instance().renderContent()).toBeDefined();
    expect(component.instance().renderContent().props.children.props.children.length).toBe(3);
    // expect(component.instance().renderContent().props.children.props.children.length).toBe(3);
  });

  test('should show name and surname', () => {
    const user = {
      person: {
        first_name: 'User',
        last_name: 'User1',
      },
      avatar: {
        url: 'http://www.gstatic.com/webp/gallery/2.jpg',
      },
      phone_number: {
        country_code: '998',
        phone_number: '901443407',
      },
    };
    const component = shallow(<ProfileSettings navigation={navigation} store={store} profile={user2} password={password} />);
    const value = component.instance().showPhoneIfExist(user, true);
    expect(value).toEqual(`+(${user.phone_number.country_code}) ${user.phone_number.phone_number}`);
  });

  test('should show phone number', () => {
    const user = {
      person: {
        first_name: 'User',
        last_name: 'User1',
      },
      avatar: {
        url: 'http://www.gstatic.com/webp/gallery/2.jpg',
      },
      phone_number: {
        country_code: '998',
        phone_number: '901443407',
      },
    };
    const component = shallow(<ProfileSettings navigation={navigation} store={store} profile={user2} password={password} />);
    const value = component.instance().showPhoneIfExist(user, true);
    expect(value).toEqual(`+(${user.phone_number.country_code}) ${user.phone_number.phone_number}`);
  });

  test('should call and render first section', () => {
    const component = shallow(<ProfileSettings navigation={navigation} store={store} profile={user2} password={password} />);
    expect(component.instance().renderFirstSection()).toBeDefined();
    expect(component.instance().renderFirstSection().props.children.length).toBe(4);
  });

  test('should call and render second section', () => {
    const component = shallow(<ProfileSettings navigation={navigation} store={store} profile={user2} password={password} />);
    expect(component.instance().renderSecondSection()).toBeDefined();
    expect(component.instance().renderSecondSection().props.children.length).toBe(2);
  });

  test('should call getUserStatus and return offline view', () => {
    const user = {
      status: 0,
    };
    offlineStatus = {
      borderColor: '#999999',
      width: 10,
      height: 10,
      borderRadius: 40,
      marginLeft: 5,
      marginTop: 4,
      borderWidth: 2,
    };
    const component = shallow(<ProfileSettings navigation={navigation} store={store} profile={user2} password={password} />);
    expect(component.instance().getUserStatus(user)).toBeDefined();
    expect(component.instance().getUserStatus(user).props.style).toEqual(offlineStatus);
  });

  test('should call getUserStatus and return online view', () => {
    const user = {
      status: 1,
    };
    onlineStatus = {
      backgroundColor: '#7ed321',
      width: 10,
      height: 10,
      borderRadius: 40,
      marginLeft: 5,
      marginTop: 4,
    };
    const component = shallow(<ProfileSettings navigation={navigation} store={store} profile={user2} password={password} />);
    expect(component.instance().getUserStatus(user)).toBeDefined();
    expect(component.instance().getUserStatus(user).props.style).toEqual(onlineStatus);
  });

    /** *
     * Testing ProfileEdit Component
     ** */

  test('ProfileEdit component should render correctly', () => {
    const component = shallow(<ProfileEdit navigation={navigation} store={store} profile={user2} />);
    expect(component).toMatchSnapshot();
    expect(component.length).toBe(1);
  });

  test('initial name and surname should be empty if user.name and user.surname is null', () => {
    const user2 = {
      person: {
        first_name: null,
        last_name: null,
      },
      avatar: {
        url: 'http://www.gstatic.com/webp/gallery/2.jpg',
      },
      phone_number: {
        country_code: '998',
        phone_number: '901443407',
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
          user2,
        },
      },
    };
    const component = shallow(<ProfileEdit navigation={navigation} store={store} profile={user2} />);
    expect(component.state().user).toEqual(user);
    expect(component.state().name).toEqual('');
    expect(component.state().surname).toEqual('');
  });

  test('ProfileEdit should render StatusBar with backgroundColor', () => {
    expectedBackgroundColor = '#598FBA';
    const component = shallow(<ProfileEdit navigation={navigation} store={store} profile={user2} />);
    const statusBar = component.find('StatusBar').at(0);
    expect(statusBar).toBeDefined();
    expect(statusBar.props().backgroundColor).toEqual(expectedBackgroundColor);
  });

  test('ProfileEdit should render input layouts', () => {
    const component = shallow(<ProfileEdit navigation={navigation} store={store} profile={user2} />);
    const inputs = component.instance().renderInputs();
    expect(inputs).toBeDefined();
    expect(inputs.props.children.length).toBe(2);
  });

  test('ProfileEdit component should call getUserStatus and return offline view', () => {
    const user = {
      status: 0,
    };
    offlineStatus = {
      borderColor: '#999999',
      width: 10,
      height: 10,
      borderRadius: 40,
      marginLeft: 5,
      marginTop: 4,
      borderWidth: 2,
    };
    const component = shallow(<ProfileEdit navigation={navigation} store={store} profile={user2} />);
    expect(component.instance().getUserStatus(user)).toBeDefined();
    expect(component.instance().getUserStatus(user).props.style).toEqual(offlineStatus);
  });

  test('ProfileEdit component should call getUserStatus and return online view', () => {
    const user = {
      status: 1,
    };
    onlineStatus = {
      backgroundColor: '#7ed321',
      width: 10,
      height: 10,
      borderRadius: 40,
      marginLeft: 5,
      marginTop: 4,
    };
    const component = shallow(<ProfileEdit navigation={navigation} store={store} profile={user2} />);
    expect(component.instance().getUserStatus(user)).toBeDefined();
    expect(component.instance().getUserStatus(user).props.style).toEqual(onlineStatus);
  });
});
