import React, { Component } from 'react';
import {
  ScorllView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export class Dashboard extends Component {

  render() {
    return (
      <ScrollView style={{ justifyContent: 'center', alignItems: 'center'}}>
        <Text>DASHBOARD</Text>
        {/*<Text>{`${this.props.user.registered ? "EXISTING" : "NEW"} USER`}</Text>*/}
        <Text>{`user id: ${this.props.user.id}`}</Text>
        <Text>{`user pass: ${this.props.user.password}`}</Text>
        <Text>{`user imei: ${this.props.user.imei}`}</Text>
        <Text>{`user phone: ${this.props.user.phone}`}</Text>
        <Text>{`user token: ${this.props.user.token}`}</Text>
        <Text>{`Device Unique ID           ${getUniqueID()}`}</Text>
        <Text>{`Device Manufacturer        ${getManufacturer()}`}</Text>
        <Text>{`Device Brand               ${getBrand()}`}</Text>
        <Text>{`Device Model               ${getModel()}`}</Text>
        <Text>{`Device ID                  ${getDeviceId()}`}</Text>
        <Text>{`System Name                ${getSystemName()}`}</Text>
        <Text>{`System Version             ${getSystemVersion()}`}</Text>
        <Text>{`Bundle ID                  ${getBundleId()}`}</Text>
        <Text>{`Number                     ${getBuildNumber()}`}</Text>
        <Text>{`App Version                ${getVersion()}`}</Text>
        <Text>{`App Version (Readable)     ${getReadableVersion()}`}</Text>
        <Text>{`Device Name                ${getDeviceName()}`}</Text>
        <Text>{`User Agent                 ${getUserAgent()}`}</Text>
        <Text>{`Device Locale              ${getDeviceLocale()}`}</Text>
        <Text>{`Device Country             ${getDeviceCountry()}`}</Text>
        <Text>{`Timezone                   ${getTimezone()}`}</Text>
        <Text>{`App Instance ID            ${getInstanceID()}`}</Text>
        <Text>{`App is running in emulator ${isEmulator()}`}</Text>
        <Text>{`App is running on a tablet ${isTablet()}`}</Text>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Dashboard);
