import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Modal,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';
import CustomStyleSheet from '../../../utils/customStylesheet'

const ic_close_black = require('../../../assets/icons/ic_close_black.png');
const ic_incoming_transaction = require('../../../assets/icons/ic_incoming.png');
const ic_outgoing_transaction = require('../../../assets/icons/ic_payment.png');

class NewTransactionsModal extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    visibility: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onClick, visibility, onCancelClick } = this.props;
    return (
      <View>
        <Modal
          onRequestClose={onCancelClick}
          animationType={'none'}
          transparent
          visible={visibility}
          onShow={() => { console.warn(JSON.stringify('axax')); }}
          onHide={() => { console.warn(JSON.stringify('xaxax')); }}
        >
          <TouchableWithoutFeedback onPress={onCancelClick}>
            <View style={styles.rootContainer}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.content}>

                  <View style={styles.imageContainer}>
                    <TouchableNativeFeedback>
                      <View style={styles.transactionImageContainer}>
                        <Image source={ic_incoming_transaction} />
                      </View>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback>
                      <View style={styles.transactionImageContainer}>
                        <Image source={ic_outgoing_transaction} />
                      </View>
                    </TouchableNativeFeedback>
                  </View>

                  <View style={{ backgroundColor: '#e0e0e0', height: 1 }} />
                  <TouchableNativeFeedback>
                    <View style={styles.closeButtonContainer}>
                      <Image source={ic_close_black} />
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
    justifyContent: 'flex-end',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
  },
  content: {
    backgroundColor: '#ffffff',
    height: 250,
    justifyContent: 'flex-end',
  },
  closeButtonContainer: {
    padding: 15,
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  transactionImageContainer: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NewTransactionsModal;
