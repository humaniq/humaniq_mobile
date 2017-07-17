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

export default class Modal extends Component {
  static propTypes = {
  };
  static navigationOptions = {
  };

  state = {};

  componentWillMount() {
  }

  handleConfirmPress = () => {
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn}>
          <Image source={ic_close} />
        </TouchableOpacity>
        <View style={styles.modal}>
          <View style={styles.content}>
            <View style={{ width: 100, height: 100, backgroundColor: 'red', borderRadius: 50 }} />
          </View>
          <TouchableOpacity style={styles.button}>
            <Image source={ic_confirm} />
          </TouchableOpacity>
        </View>
      </View>
    );
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
  button: {
    height: 58,
    width: 328,
    backgroundColor: '$cBrand',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
