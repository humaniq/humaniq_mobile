### This version of the app has been deprecated since September 2017. It doesn't have any features we have implemented since that time. New version of the app hasn't been released to open source, yet.

# HUMANIQ MOBILE [LITE]

[![Vexor status](https://ci.vexor.io/projects/9c78b9c5-e2d8-4209-8acf-b67152d7024f/status.svg)](https://ci.vexor.io/ui/projects/9c78b9c5-e2d8-4209-8acf-b67152d7024f/builds)

## About
[Humaniq](www.humaniq.co) is simple and secure 4th generation mobile bank. Made on blockchain with Bio ID.
LITE version of the mobile app (without text), is specially designed for nonreaders and people with dyslexia.


## Getting started
This app is based on React Native framework.
To run this app on your device or simulator please follow [official documentation instructions](https://facebook.github.io/react-native/docs/getting-started.html).

### Setup Android:
1. [Configure SSH Keys](https://github.com/humaniq/humaniq_mobile/pull/21#issue-242430854)
1. Run `npm i` in project root dir
1. Run `react-native link`
1. Install Android studio and all Android related build tools, according to official React Native documentation
1. Run AVD
1. Run `react-native run-android` in project root dir

### Android troubleshooting:
#### Build:

1. Delete previously installed apk from device:
```
Execution failed for task ':app:installDebug'.
com.android.builder.testing.api.DeviceException: 
com.android.ddmlib.InstallException: 
Failed to finalize session : INSTALL_FAILED_VERSION_DOWNGRADE
```

#### Runtime:
1. AVD does not have IMEI and has conflict with IMEI library.
For now you should replace IMEI assignment in Java code with custom string or use real device.


### Tools:
#### Code inspection:
* ESlint (Aribnb, babel-parser)

To lint run ```node_modules/.bin/eslint ./src```

### Running Tests:
1. To start tests, run `npm test`
2. To start tests with snapshot, run `npm test -- -u`
3. To start tests on single component, run `npm test -- -u <test_component>`

#### Example
`npm test -- -u Login`
