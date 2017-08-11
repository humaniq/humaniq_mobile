import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import CustomStyleSheet from '../../../utils/customStylesheet';

const ic_sms = require('../../../assets/icons/ic_sms.png');
const ic_clock = require('../../../assets/icons/ic_clock.png');

const propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  cooldownTime: PropTypes.number,
};

function str_pad_left(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

function prettyTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${str_pad_left(minutes, '0', 2)}:${str_pad_left(seconds, '0', 2)}`;
}

export default function RequestSmsButton(props) {
  const disabled = props.disabled;
  const cooldownTime = parseInt(props.cooldownTime, 10);

  return (
    // using TouchH instead TouchO to disable pressing when prop active == false
    <TouchableHighlight
      style={[styles.container, disabled && cooldownTime === 0 ? styles.disabled : null]}
      onPress={disabled ? null : props.onPress}
      underlayColor={'transparent'}
      activeOpacity={0.5}
    >
      {disabled && cooldownTime > 0 ?
        <View style={styles.cooldownContainer}>
          <Text style={styles.cooldownTxt}>{prettyTime(cooldownTime)}</Text>
          <Image source={ic_clock} />
        </View> :
        <Image source={ic_sms} />
      }
    </TouchableHighlight>
  );
}

RequestSmsButton.propTypes = propTypes;

const styles = CustomStyleSheet({
  container: {
    height: 45,
    width: 155,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$cBrand_dark',
    borderWidth: 1,
    borderColor: '$cPaper',
    borderRadius: 3,
    marginRight: 9,
  },
  cooldownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cooldownTxt: {
    color: '$cPaper',
    marginRight: 4,
  },
  disabled: {
    borderWidth: 0,
    backgroundColor: '$cPaper',
    opacity: 0.6,
  },
});
