import React from 'react';
import {
  TouchableHighlight,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import CustomStyleSheet from '../../../utils/customStylesheet';

const ic_confirm = require('../../../assets/icons/ic_confirm.png');

const propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default function HelpButton(props) {
  const disabled = props.disabled;
  console.log('disabled for button', disabled);
  return (
    // using TouchH instead TouchO to disable pressing when prop active == false
    <TouchableHighlight
      style={[styles.container, disabled && styles.disabled, props.containerStyle]}
      onPress={disabled ? null : props.onPress}
    >
      <Image source={ic_confirm} />
    </TouchableHighlight>
  );
}

HelpButton.propTypes = propTypes;

const styles = CustomStyleSheet({
  container: {
    height: 45,
    width: 155,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$cPaper',
    borderRadius: 3,
  },
  disabled: {
    opacity: 0.6,
  },
});
