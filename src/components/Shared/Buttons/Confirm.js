/* eslint-disable */
import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableHighlight,
  Image,
} from 'react-native';
import CustomStyleSheet from '../../../utils/customStylesheet';

const confirm = require('../../../assets/icons/ic_confirm_dark.png');

export default class Confirm extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  render() {
    // using TouchH instead TouchO to disable pressing when prop active == false
    const { active, onPress } = this.props;
    return (
      <TouchableHighlight
        style={[styles.container, active && styles.active]}
        onPress={active ? onPress : null}
      >
        {active ? <Text>OK</Text> : <Image source={confirm} />}
      </TouchableHighlight>
    );
  }
}

const styles = CustomStyleSheet({
  container: {
    // flex: 1,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'tomato',
    borderTopWidth: 1,
    borderTopColor: '$cGrayLight',
  },
  active: {
    backgroundColor: '$cGray',
    borderTopWidth: 0,
  },
});
