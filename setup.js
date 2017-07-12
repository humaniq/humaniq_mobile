/**
 * Created by root on 6/28/17.
 */

jest.mock('react-native-camera', () => {
    return {
        constants:  {
            Aspect: {},
            BarCodeType: {},
            Type: {},
            CaptureMode: {},
            CaptureTarget: {},
            CaptureQuality: {},
            Orientation: {},
            FlashMode: {},
            TorchMode: {}
        }
    }
});

jest.mock('react-native-network-info', () => 'DeviceInfo')
//
jest.mock('react-native-fetch-blob', () => {
    return {
        DocumentDir: () => {},
    }
});

jest.mock('Linking', () => {
    return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        openURL: jest.fn(),
        canOpenURL: jest.fn(),
        getInitialURL: jest.fn(),
    }
})
