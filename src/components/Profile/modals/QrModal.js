import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Modal,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode';
import CustomStyleSheet from '../../../utils/customStylesheet'

const ic_clipboard = require('../../../assets/icons/ic_copy_blue.png');

class QrModal extends Component {
  static propTypes = {
    onClipboardClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    visibility: PropTypes.bool.isRequired,
    wallet: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onClipboardClick, visibility, wallet, onCancelClick } = this.props;
    return (
      <View>
        <Modal
          onRequestClose={onCancelClick}
          animationType={'fade'}
          transparent
          visible={visibility}
        >
          <TouchableWithoutFeedback onPress={onCancelClick}>
            <View style={styles.rootContainer}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.content}>
                  <View style={styles.qrContainer}>
                    <QRCode
                      value={wallet.address}
                      size={270}
                    />
                  </View>
                  <View style={{ backgroundColor: '#e0e0e0', height: 1 }} />
                  <TouchableNativeFeedback
                    delayPressIn={0}
                    onPress={onClipboardClick}
                  >
                    <View style={{ padding: 17, alignItems: 'center' }}>
                      <Image
                        resizeMode="contain"
                        style={styles.clipboard}
                        source={ic_clipboard}
                      />
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </TouchableWithoutFeedback>

            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = CustomStyleSheet({
  rootContainer: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
  },
  qrContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  content: {
    margin: 16,
    backgroundColor: '#ffffff',
  },
  image: {
    width: null,
    height: 270,
    margin: 28,
  },
  clipboard: {
    width: 28,
    height: 28,
  },
});

export default QrModal;
