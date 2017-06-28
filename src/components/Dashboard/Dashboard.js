import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Dashboard extends Component {
  render() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center'}}>
        <Text>DASHBOARD</Text>
        <Text>{`${this.props.user.registered ? "EXISTING" : "NEW"} USER`}</Text>
        <Text>{`user id: ${this.props.user.id}`}</Text>
        <Text>{`user pass: ${this.props.user.password}`}</Text>
        <Text>{`user imei: ${this.props.user.imei}`}</Text>
        <Text>{`user phone: ${this.props.user.phone}`}</Text>
        <Text>{`user token: ${this.props.user.token}`}</Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Dashboard);
