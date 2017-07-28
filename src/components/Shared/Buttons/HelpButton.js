import React from 'react';
import {
  TouchableHighlight,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import CustomStyleSheet from '../../../utils/customStylesheet';

const ic_help = require('../../../assets/icons/ic_help.png');

const propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default function HelpButton(props) {
  return (
    // using TouchH instead TouchO to disable pressing when prop active == false
    <TouchableHighlight style={styles.container} onPress={props.onPress}>
      <Image source={props.source != null ? this.props.source : ic_help} />
    </TouchableHighlight>
  );
}

HelpButton.propTypes = propTypes;

const styles = CustomStyleSheet({
  container: {
    width: 155,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '$cPaper',
    borderRadius: 3,
  },
});
