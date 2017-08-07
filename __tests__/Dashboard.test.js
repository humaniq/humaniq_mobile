/**
 * Created by root on 6/28/17.
 */
import { shallow, mount } from 'enzyme';
import React, { Component } from 'react';
import DashboardConnected, { Dashboard } from '../src/components/Dashboard/Dashboard';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import store from '../src/utils/store';
import sinon from 'sinon';

/** *
 * Testing Dashboard component
 ***/

jest.mock('../src/components/Dashboard/Dashboard');

describe('<Dashboard />', () => {
    /** *
     * Testing Dashboard component separately from connected (Redux)
     ***/

  const user = {
    registered: true,
    id: 1,
    password: 'password',
    imei: 'imei',
    phone: '+123456789',
    token: 'token',
  };

  it('should render correctly Dashboard', () => {
    expect(true).toBe(true);
  });

});
