/**
 * Created by root on 6/28/17.
 */
import {shallow, render, mount} from 'enzyme'
import React, { Component } from 'react';
import mockStore from 'redux-mock-store'
import fetch from 'isomorphic-fetch'

describe('Endpoint test', () => {
    it('should work with isRegistered', async () => {
        const url = 'https://beta-api.humaniq.co/tapatybe/api/v1/registered'
        fetch(url, {
            'method': 'POST',
            'body': {}
        })
        .then((resp) => resp.json())
    })
})