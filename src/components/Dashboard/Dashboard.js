/* eslint-disable */
import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeviceInfo from 'react-native-device-info';
import IMEI from 'react-native-imei';
import { NetworkInfo } from 'react-native-network-info';

export class Dashboard extends Component {

  render() {
    return (
      <ScrollView>
        <Text>DASHBOARD</Text>
        {/* <Text>{`${this.props.user.registered ? "EXISTING" : "NEW"} USER`}</Text>*/}
        <Text>{JSON.stringify(this.props.user, null,2)}</Text>
        <Text>{`user id: ${this.props.user.id}`}</Text>
        <Text>{`user pass: ${this.props.user.password}`}</Text>
        <Text>{`user imei: ${this.props.user.imei}`}</Text>
        <Text>{`user phone: ${this.props.user.phone}`}</Text>
        <Text>{`user token: ${this.props.user.token}`}</Text>
        <Text>{'-------------------------------------------------'}</Text>
        <Text>{'DEVICE INFO'}</Text>
        <Text>{'-------------------------------------------------'}</Text>
        <Text>{`Device Unique ID           ${DeviceInfo.getUniqueID()}`}</Text>
        <Text>{`Device Manufacturer        ${DeviceInfo.getManufacturer()}`}</Text>
        <Text>{`Device Brand               ${DeviceInfo.getBrand()}`}</Text>
        <Text>{`Device Model               ${DeviceInfo.getModel()}`}</Text>
        <Text>{`Device ID                  ${DeviceInfo.getDeviceId()}`}</Text>
        <Text>{`System Name                ${DeviceInfo.getSystemName()}`}</Text>
        <Text>{`System Version             ${DeviceInfo.getSystemVersion()}`}</Text>
        <Text>{`Bundle ID                  ${DeviceInfo.getBundleId()}`}</Text>
        <Text>{`Number                     ${DeviceInfo.getBuildNumber()}`}</Text>
        <Text>{`App Version                ${DeviceInfo.getVersion()}`}</Text>
        <Text>{`App Version (Readable)     ${DeviceInfo.getReadableVersion()}`}</Text>
        <Text>{`Device Name                ${DeviceInfo.getDeviceName()}`}</Text>
        <Text>{`User Agent                 ${DeviceInfo.getUserAgent()}`}</Text>
        <Text>{`Device Locale              ${DeviceInfo.getDeviceLocale()}`}</Text>
        <Text>{`Device Country             ${DeviceInfo.getDeviceCountry()}`}</Text>
        <Text>{`Timezone                   ${DeviceInfo.getTimezone()}`}</Text>
        <Text>{`App Instance ID            ${DeviceInfo.getInstanceID()}`}</Text>
        <Text>{`App is running in emulator ${DeviceInfo.isEmulator()}`}</Text>
        <Text>{`App is running on a tablet ${DeviceInfo.isTablet()}`}</Text>

        <Text>{'-------------------------------------------------'}</Text>
        <Text>{'IMEI'}</Text>
        <Text>{'-------------------------------------------------'}</Text>
        <Text>{`IMEI: ${IMEI.getImei()}`}</Text>

        <Text>{'-------------------------------------------------'}</Text>
        <Text>{'BATTERY-INFO'}</Text>
        <Text>{'-------------------------------------------------'}</Text>

        <Text>{'-------------------------------------------------'}</Text>
        <Text>{'NETWORK INFO / not working? :|'}</Text>
        <Text>{'-------------------------------------------------'}</Text>
        <Text>{`IP ${NetworkInfo.getIPAddress(ip => ip)}`}</Text>
        <Text>{`IPV4 ${NetworkInfo.getIPV4Address(ipv4 => ipv4)}`}</Text>
        <Text>{`SSID ${NetworkInfo.getSSID(ssid => ssid)}`}</Text>
        <Text>{`BSSID ${NetworkInfo.getBSSID(bssid => bssid)}`}</Text>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Dashboard);
