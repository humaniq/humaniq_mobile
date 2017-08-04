import React, { Component } from 'react';
import {
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
const ic_photo_holder = require('../../../assets/icons/ic_avatar_holder.png');

class TransactionsModal extends Component {
  static propTypes = {
    onChatClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    visibility: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    currency: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getTransactionStatusImage = (item) => {
    switch (item.status) {
      // pending
      case 0:
        return ic_wait;
      // completed
      case 1:
        return ic_done;
      // invalid
      case 2:
        return ic_cancel;
      default:
        return ic_wait;
    }
  };

  render() {
    const {
      onChatClick,
      visibility,
      item,
      onCancelClick,
      currency,
      rate,
    } = this.props;
    const sender = item.from_user;
    const receiver = item.to_user;
    let user = {};
    if (item.type === 0) {
      user = receiver;
    } else if (item.type === 1) {
      user = sender;
    }
    const priceBeforePoint = item.amount ? item.amount.toString().split('.')[0] : '';
    const priceAfterPoint = item.amount ? item.amount.toString().split('.')[1] : '';
    const amFloat = Math.round(parseFloat(item.amount) * rate * 100) / 100;

    return (
      <View>
        {visibility ?
          <Modal
            onRequestClose={onChatClick}
            animationType={'fade'}
            transparent
            visible={visibility}
          >
            <TouchableWithoutFeedback onPress={onCancelClick}>
              <View style={styles.rootContainer}>
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View style={styles.content}>
                    <View style={styles.header}>
                      <View style={{ flexDirection: 'row', flex: 1 }}>
                        <Text style={styles.date}>{item.timestamp ? moment.unix(item.timestamp).format('DD.MM.YYYY, hh:mm:ss') : ''}</Text>
                        <Image
                          style={styles.statusImage}
                          source={this.getTransactionStatusImage(item)}
                        />
                      </View>
                      <TouchableOpacity onPress={onChatClick}>
                        <Image
                          resizeMode="contain"
                          style={styles.chat}
                          source={ic_chat}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.avatarContainer}>
                      <Image
                        style={styles.avatar}
                        source={user && user.avatar && user.avatar.url
                            ? { uri: user.avatar.url }
                            : ic_photo_holder}
                      />
                      <Image
                        resizeMode="contain"
                        style={styles.image2}
                        source={item.type === 1 ? ic_outgoing : ic_incoming}
                      />
                    </View>
                    {user ? this.renderCredentials(user) : this.renderWallet(item)}
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceInt}>
                        {`${priceBeforePoint}.`}
                        <Text style={styles.priceDecimal}>
                          { priceAfterPoint || '00'} HMQ</Text>
                      </Text>
                    </View>
                    <Text style={styles.price}>{`${amFloat} $`}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>

          </Modal>
              : null
          }

      </View>
    );
  }

  renderCredentials = (user) => {
    const countryCode = user && user.phone_number
        ? user.phone_number.country_code : 0;
    const phone = user && user.phone_number
        ? user.phone_number.phone_number : 0;
    const userName = user && user.person
        ? user.person.first_name : '';
    const userLastName = user && user.person
        ? user.person.last_name : '';
    return (
      <View>
        <Text style={styles.name}>{`${userName} ${userLastName}`}</Text>
        <Text style={styles.phone}>{`+(${countryCode})`} {phone}</Text>
      </View>
    );
  };

  renderWallet = (item) => {
    const wallet = item.from_address;
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
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 18,
  },
  date: {
    fontSize: 14,
    color: '#1b1d1d',
    marginRight: 9,
  },
  statusImage: {
    width: 22,
    height: 22,
    marginLeft: 2,
  },
  chat: {
    width: 34,
    height: 34,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 110,
    round: 110,
  },
  avatarContainer: {
    paddingRight: 8,
    paddingBottom: 8,
    marginTop: 16,
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
  name: {
    fontSize: 21,
    color: '#1b1d1d',
  },
  phone: {
    fontSize: 14,
    color: '#1b1d1d',
  },
  priceContainer: {
    marginTop: 25,
  },
  priceInt: {
    fontSize: 36,
    color: '#212121',
  },
  priceDecimal: {
    color: '#8b8b8b',
    fontSize: 22,
  },
  price: {
    fontSize: 18,
    color: '#4d4d4d',
    marginBottom: 30,
  },
});

export default TransactionsModal;
