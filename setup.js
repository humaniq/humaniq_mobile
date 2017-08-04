/**
 * Created by root on 6/28/17.
 */

jest.mock('react-native-camera', () => ({
  constants: {
    Aspect: {},
    BarCodeType: {},
    Type: {},
    CaptureMode: {},
    CaptureTarget: {},
    CaptureQuality: {},
    Orientation: {},
    FlashMode: {},
    TorchMode: {},
  },
}));
jest.mock('react-native-android-library-humaniq-api', () => ({
  HumaniqProfileApiLib: {
    getAccountProfile: () => new Promise((resolve, reject) => {}),
    getTransactions: () => new Promise((resolve, reject) => {}),
    getBalance: () => new Promise((resolve, reject) => {}),
    getExchangeUsd: () => new Promise((resolve, reject) => {}),
  },
  HumaniqTokenApiLib: {
    saveCredentials: () => new Promise((resolve, reject) => {}),
  },
}));
jest.mock('react-native-network-info', () => 'DeviceInfo');
jest.mock('react-native-fetch-blob', () => ({
  DocumentDir: () => {},
  fs: {
    dirs: {
      CacheDir: 'path',
    },
  },
}));
jest.mock('react-native-qrcode', () => ({
  decelerationRate: () => jest.fn(),
}));

jest.mock('Linking', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
  getInitialURL: jest.fn(),
}));
