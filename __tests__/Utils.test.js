/**
 * Created by root on 6/28/17.
 */
import { Dimensions } from 'react-native';
import {
    fontScale,
    viewPortCalc,
} from '../src/utils/units'

/***
 * Testing Utils
 ***/

describe('Utils test', () => {

    /***
     * Testing fontScale()
     ***/

    test('fontScale should return value', () => {
        expect(fontScale(5, 2)).toEqual(2.5)
    })

    test('fontScale should return 25', () => {
        expect(fontScale(50, 2)).toEqual(25)
    })

    test('fontScale should return Nan', () => {
        expect(fontScale(null, null)).toEqual(NaN)
    })

    /***
     * Testing viewPortCalc()
     ***/

    test('viewPortCalc should take strings', () => {
        const px = "12"
        const expectedValue = 12
        expect(viewPortCalc(px, 10, 10)).toEqual(expectedValue)
    })

    test('viewPortCalc should take integers', () => {
        const px = 12
        const expectedValue = 12
        expect(viewPortCalc(px, 10, 10)).toEqual(expectedValue)
    })

    test('viewPortCalc return values should be equal', () => {
        const stringValue = viewPortCalc("20", 10, 10)
        const integerValue = viewPortCalc(20, 10, 10)
        expect(stringValue).toEqual(integerValue)
    })

    test('viewPortCalc return Nan', () => {
        const stringValue = viewPortCalc("20", null, null)
        const integerValue = viewPortCalc(20, 10, 10)
        expect(stringValue).toEqual(NaN)
    })
})