import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import { HumaniqContactsApiLib, HumaniqProfileApiLib } from 'react-native-android-library-humaniq-api';

import CustomStyleSheet from '../../../utils/customStylesheet';

const ic_done = require('../../../assets/icons/ic_done.png');
const ic_wait = require('../../../assets/icons/ic_wait.png');
const ic_cancel = require('../../../assets/icons/ic_transaction_cancel.png');
const ic_chat = require('../../../assets/icons/ic_chat_blue.png');
// const ic_bot = require('../../../assets/icons/ic_humaniq_bot.png');
const ic_outgoing = require('../../../assets/icons/ic_payment.png');
const ic_incoming = require('../../../assets/icons/ic_incoming.png');
const ic_photo_holder = require('../../../assets/icons/ic_mock.png');
const ic_confirm = require('../../../assets/icons/ic_confirm_white.png');

class TransactionConfirmModal extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    visibility: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      rate: 0,
    };
  }

  componentDidMount() {
    console.warn(JSON.stringify(this.props.item));
    HumaniqProfileApiLib.getExchangeUsd('1').then((data) => {
      const { USD = 0 } = data;
      this.setState({
        rate: USD,
      });
    });
  }

  render() {
    const { onClick, visibility, item, onCancelClick, contacts } = this.props;
    const { rate } = this.state;

    const priceBeforePoint
        = item.amount ? item.amount.toString().split('.')[0] : '';
    const priceAfterPoint
        = item.amount ? item.amount.toString().split('.')[1] : '';

    const amFloat = Math.round(parseFloat(item.amount) * rate * 100) / 100;
    const contact = contacts.find(cnt => cnt.id === item.contactID);

    return (
      <View>
        <Modal
          onRequestClose={onClick}
          animationType={'fade'}
          transparent
          visible={visibility}
        >
          <TouchableWithoutFeedback onPress={onCancelClick}>
            <View style={styles.rootContainer}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.content}>
                  <View style={styles.header} />
                  <View style={{ alignSelf: 'center', alignItems: 'center' }}>
                    <View style={styles.avatarContainer}>
                      <Image
                        style={styles.avatar}
                        source={contact && contact.avatar
                            ? { uri: contact.avatar }
                            : ic_photo_holder
                        }
                      />
                      <Image
                        resizeMode="contain"
                        style={styles.image2}
                        source={ic_outgoing}
                      />
                    </View>
                    {contact && contact.name ? this.renderCredentials(contact) : this.renderWallet(contact)}
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceInt}>
                        {`${priceBeforePoint}.`}
                        <Text style={styles.priceDecimal}>
                          { priceAfterPoint || '00'} HMQ</Text>
                      </Text>
                    </View>
                    <Text style={styles.price}>{`${amFloat} $`}</Text>

                  </View>

                  <TouchableOpacity style={styles.button} onPress={onClick}>
                    <Image source={ic_confirm} />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>

        </Modal>
      </View>
    );
  }


  renderCredentials = contact => (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.name}>{`${contact.name}`}</Text>
      <Text style={styles.phone}>{`${contact.phone}`}</Text>
    </View>
  );

  renderWallet = (contact) => {
    const wallet = contact.phone
    return (
      <View style={{ flex: 1, alignSelf: 'center' }}>
        <Text style={styles.name}>
          {wallet}
        </Text>
      </View>
    );
  };

}

const styles = CustomStyleSheet({
  rootContainer: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
  },
  content: {
    margin: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 18,
    marginBottom: 16,
  },
  phone: {
    fontSize: 14,
    color: '#1b1d1d',
  },
  date: {
    fontSize: 14,
    color: '#1b1d1d',
    marginRight: 9,
  },
  statusImage: {
    width: 20,
    height: 20,
  },
  chat: {
    width: 30,
    height: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    round: 100,
  },
  avatarContainer: {
    paddingRight: 8,
    paddingBottom: 8,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  image2: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
  },
  phoneSmall: {
    color: '#1b1d1d',
    fontSize: 12,
  },
  name: {
    color: '#1b1d1d',
    fontSize: 20,
  },
  priceContainer: {
    marginTop: 25,
  },
  priceInt: {
    fontSize: 30,
    color: '#212121',
  },
  priceDecimal: {
    color: '#8b8b8b',
    fontSize: 18,
  },
  price: {
    fontSize: 16,
    color: '#4d4d4d',
    marginBottom: 30,
  },
  button: {
    marginTop: 16,
    height: 58,
    backgroundColor: '#3aa3e3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TransactionConfirmModal;
