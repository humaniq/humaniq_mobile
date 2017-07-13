/* eslint-disable import/no-unresolved */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';

const ovalCopy = require('./../../assets/icons/oval_copy_3.png');

export default class Send extends React.Component {
  render() {
    if (this.props.text.trim().length > 0) {
      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
            this.props.onSend({ text: this.props.text.trim() }, true);
          }}
          accessibilityTraits="button"
        >
          <Image source={ovalCopy} style={{ margin: 7 }} />
        </TouchableOpacity>
      );
    }
    return <View />;
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
  },
  text: {
    color: '#0084ff',
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: 'transparent',
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
});

Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: 'Send',
  containerStyle: {},
  textStyle: {},
};

Send.propTypes = {
  text: React.PropTypes.string,
  onSend: React.PropTypes.func,
  containerStyle: View.propTypes.style,
};
