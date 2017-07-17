/**
 * Created by root on 6/28/17.
 */
import { shallow, render, mount } from 'enzyme';
import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000; // 40 second timeout

/** *
 * Testing Endpoints
 ***/

const apiCall = (url, body) => fetch(url, {
  method: 'POST',
  body,
  headers: {
    'Content-Type': 'application/json',
  },
}).then(resp => resp.json())
    .then(response => response);

const authenticatedUserId = '';

describe('API test', () => {
  test('axax', () => {
    expect(1).toBe(1);
  });

    /** *
     * Testing isRegistered Endpoint
     ***/

    // it('should work with isRegistered', async() => {
    //     const url = 'https://beta-api.humaniq.co/tapatybe/api/v1/registered'
    //     const response = await apiCall(url,
    //         JSON.stringify({
    //         facial_image: photo
    //     }))
    //     expect(typeof response).toEqual('object')
    //     expect(response.code).toBe(20000)
    //     expect(response.message).toEqual('Facial image found')
    //
    // })
    //
    // it('should return Unprocessable Entity status', async() => {
    //     const fake_photo = "/9Jsd28euas8d89aud8sa/+989898sad212"
    //     const url = 'https://beta-api.humaniq.co/tapatybe/api/v1/registered'
    //     const response = await apiCall(url, JSON.stringify({
    //         facial_image: fake_photo
    //     }))
    //     console.log(response)
    //     expect(typeof response).toEqual('object')
    //     expect(response.errors[0].status).toEqual('Unprocessable Entity')
    //     expect(response.errors[0].code).toEqual("422")
    //
    // })
    //
    // /***
    //  * Testing Registration Endpoint
    //  ***/
    //
    // it('Registration should return succes status', async() => {
    //     const url = 'https://beta-api.humaniq.co/tapatybe/api/v1/registration'
    //     const response = await apiCall(url, JSON.stringify({
    //         facial_image: photo,
    //         password: "foo",
    //         metadata: {
    //             react_native_imei: {
    //                 device_imei: "1",
    //             },
    //         }
    //     }))
    //     console.log(response)
    //     expect(typeof response).toEqual('object')
    //     expect(response.code).toEqual(20100)
    //     expect(response.message).toEqual("Registration created successfully")
    //
    // })
    //
    // /***
    //  * Testing Create Account Phone Number Endpoint
    //  ***/
    //
    // it('Should create account phone number', async() => {
    //     const url = 'https://beta-api.humaniq.co/tapatybe/api/v1/account/phone_number'
    //     const response = await apiCall(url, JSON.stringify({
    //         account_id: "1540785652075857130",
    //         phone_number: {
    //             country_code: "1",
    //             phone_number: "123456789",
    //         }
    //     }))
    //     console.log(response)
    //     expect(typeof response).toEqual('object')
    //     // expect(response.code).toEqual(20100)
    //     // expect(response.message).toEqual("Account Phone Number created successfully, validation code sent")
    //
    // })

    /** *
     * Testing Authentication Endpoint
     ***/

    // it('Should Authenticate User', async() => {
    //     const url = 'https://beta-api.humaniq.co/tapatybe/api/v1/authenticate/user'
    //     const response = await apiCall(url, JSON.stringify({
    //         facial_image: photo,
    //         password: "foo",
    //         metadata: {
    //             react_native_imei: {
    //                 device_imei: "1",
    //             },
    //         }
    //     }))
    //     console.log(response)
    //     expect(typeof response).toEqual('object')
    //     expect(response.code).toEqual(20000)
    //     expect(response.message).toEqual("Authentication Successful")
    //
    // })
    //
    // it('Should Not Authenticate User', async() => {
    //     const url = 'https://beta-api.humaniq.co/tapatybe/api/v1/authenticate/user'
    //     const response = await apiCall(url, JSON.stringify({
    //         facial_image: "/9test-as-d-asd-2312312+/asdasdsad/123q1qz",
    //         password: "foo",
    //         metadata: {
    //             react_native_imei: {
    //                 device_imei: "1",
    //             },
    //         }
    //     }))
    //     console.log(response)
    //     expect(typeof response).toEqual('object')
    //     expect(response.errors[0].status).toEqual('Unprocessable Entity')
    //     expect(response.errors[0].code).toEqual("422")
    // })

    /** *
     * Testing Deauthentication Endpoint
     ***/

    // it('Should Not Deauthenticate User', async() => {
    //     const url = 'https://beta-api.humaniq.co/tapatybe/api/v1/deauthenticate/user'
    //     const response = await apiCall(url, JSON.stringify({
    //         account_id: "1540289397579056141"
    //     }))
    //     console.log(response)
    //     expect(typeof response).toEqual('object')
    //     expect(response.code).toEqual(40400)
    //     expect(response.message).toEqual("User is not authenticated")
    //
    // })
    //
    // it('Should Deauthenticate User', async() => {
    //     const url = 'https://beta-api.humaniq.co/tapatybe/api/v1/deauthenticate/user'
    //     const response = await apiCall(url, JSON.stringify({
    //         account_id: "1547741806014236102"
    //     }))
    //     console.log(response)
    //     expect(typeof response).toEqual('object')
    //     // expect(response.code).toEqual(20100)
    //     // expect(response.message).toEqual("User is not authenticated")
    //
    // })
});
