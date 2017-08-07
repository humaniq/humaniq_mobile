import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import CustomStyleSheet from '../../../utils/customStylesheet';

const ic_confirm = require('../../../assets/icons/ic_confirm_white.png');
const ic_close = require('../../../assets/icons/ic_close_black.png');
const sadBot = require('../../../assets/icons/sad_bot.png');
const noFace = require('../../../assets/icons/no_face.png');

export default class Modal extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    code: PropTypes.number,
    visible: PropTypes.bool.isRequired,
  };

  renderErrorMessage = () => {
    switch (this.props.code) {
      case 3001:
        return (<Image source={noFace} />);
      default:
        return (<Image source={sadBot} />);
    }
  };

  render() {
    if (this.props.visible) {
      return (
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeBtn} onPress={this.props.onPress}>
            <Image source={ic_close} />
          </TouchableOpacity>
          <View style={styles.modal}>
            {/* here should be image rendered based on status code in renderErrorMessage */}
            <View style={styles.content}>
              {this.renderErrorMessage() }
            </View>
            <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
              <Image source={ic_confirm} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return <View/>;
  }
}

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00000099', // 60
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    paddingRight: 16,
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 30,
  },
  modal: {
    marginBottom: 120,
  },
  content: {
    backgroundColor: '$cPaper',
    height: 318,
    width: 328,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    height: 58,
    width: 328,
    backgroundColor: '$cBrand',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
