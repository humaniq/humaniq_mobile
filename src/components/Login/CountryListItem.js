import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

export class CountryListItem extends React.PureComponent {
    static propTypes = {
      o: PropTypes.string,
      resname: PropTypes.string,
      onBackPress: PropTypes.func.isRequired,
    };
    render() {
      return (
        <TouchableOpacity
          style={{
            height: vh(56),
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => this.props.onBackPress(this.props.o.dial_code, this.props.o.code, this.props.resname)}
        >
          <View style={styles.flagAndCountryName}>
            <Image style={styles.flag} source={{ uri: this.props.resname }} />
            <Text style={styles.countryName}>
              {this.props.o.name}
            </Text>
          </View>
          <Text style={styles.dialCode}>
            {this.props.o.dial_code}
          </Text>
        </TouchableOpacity>
      );
    }
  }