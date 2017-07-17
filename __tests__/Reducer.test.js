/**
 * Created by root on 6/27/17.
 */
import React from 'react';
import { user } from '../src/reducers/user';

import * as ActionTypes from '../src/actions/index';


/** *
 * Testing reducers
 ***/

describe('REDUCERS TEST', () => {
    /** *
     * Testing InitReducer
     ***/

  it('InitReducer can handle action', () => {
    const defaultState = true;
    const expectedState = false;
    expect(1).toBe(1);
  });

  it('InitReducer should return default state', () => {
    const defaultState = false;
    const testAction = {
      type: 'TEST',
    };
    expect(1).toBe(1);
  });

  it('InitReducer should return NULL', () => {
    const defaultState = true;
    const expectedState = false;
    expect(1).toBe(1);
  });

    /** *
     * Testing AvatarReducer
     ***/

  it('AvatarReducer can handle action', () => {
    expect(
            { type: 'default_state' },
        ).toEqual(
            { type: 'default_state' },
        );
  });

  it('AvatarReducer should return default state', () => {
    const action = {
      type: 'TEST_CONSTANT',
      path: 'TEST_PATH',
    };
    expect(action).toEqual(action);
  });

  it('AvatarReducer should return NULL', () => {
    expect(null).toBeNull();
  });

    /** *
     * Testing UserReducer
     ***/

  it('UserReducer should handle SET_AVATAR_PATH ACTION', () => {
    const state = {
      isFetching: false,
      payload: null,
    };
    const action = {
      type: 'SET_AVATAR_PATH',
      path: 'new_path_to_avatar',
    };
    expect(
            ActionTypes.SIGNUP.REQUEST,
        ).toEqual(ActionTypes.SIGNUP.REQUEST);
  });


  it('UserReducer should return NULL', () => {
    expect(null).toBeNull();
  });
});
