import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableNativeFeedback,
  Animated,
} from 'react-native';
import CustomStyleSheet from '../../utils/customStylesheet';

const ic_incoming = require('../../assets/icons/ic_incoming.png');
const ic_outgoing = require('../../assets/icons/ic_payment.png');
// const ic_image_holder = require('../../assets/icons/ic_humaniq_bot.png');
const ic_done = require('../../assets/icons/ic_done.png');
const ic_wait = require('../../assets/icons/ic_wait.png');
const ic_cancel = require('../../assets/icons/ic_transaction_cancel.png');
const ic_photo_holder = require('../../assets/icons/ic_mock.png');

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const divideBy = 100000000;
    let sign = '';
    const { item, currentIndex, size, onClick } = this.props;
    const priceBeforePoint = item.amount ? (parseFloat(item.amount / divideBy)).toString().split('.')[0] : '';
    const priceAfterPoint = item.amount ? (parseFloat(item.amount / divideBy)).toString().split('.')[1] : '';

    const receiver = item.from_user ? item.from_user : {};
    const sender = item.to_user ? item.to_user : {};
    let user = {};

    // type == 0 -> incoming (receive)
    // type == 1 -> outgoing (sent)

    if (item.type === 0) {
      user = receiver;
      sign = '+';
    } else if (item.type === 1) {
      user = sender;
    }

    return (
        <Animated.View style={styles.container}>
          <TouchableNativeFeedback
              onPress={onClick}
          >
            <Animated.View
                style={[styles.rootContainer]}
            >
              <View style={styles.avatarContainer}>
                <Image
                    style={styles.image}
                    source={user && user.avatar && user.avatar.url
                        ? { uri: user.avatar.url }
                        : ic_photo_holder
                    }
                />
                <Image
                    style={styles.image2}
                    source={item.type === 0 ? ic_incoming : ic_outgoing}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.transactionContainer}>
                  {this.renderCredentials(user, item)}
                  <View style={styles.rightContainer}>
                    <Text style={styles.priceInt}>
                      {`${sign}${priceBeforePoint}.`}
                      <Text style={styles.priceDecimal}>
                        { priceAfterPoint || '00'} HMQ</Text>
                    </Text>
                    <Image
                        style={styles.statusImage}
                        source={this.getTransactionStatusImage(item)}
                    />
                  </View>
                </View>
                {currentIndex !== size - 1 ? this.showDivider() : <View style={{ marginBottom: 20 }} />}
              </View>
            </Animated.View>
          </TouchableNativeFeedback>
        </Animated.View>
    );
  }

  renderPhone = (user) => {
    const phones = user && user.phone_number
        ? `+(${user.phone_number.country_code}) ${user.phone_number.phone_number}` : '';
    return (
        <View style={{ flex: 1, alignSelf: 'center' }}>
          <Text style={styles.phone}>
            {phones}
          </Text>
        </View>
    );
  };


  renderNameWithPhone = (user) => {
    const names = user && user.person
        ? `${user.person.first_name} ${user.person.last_name}` : '';
    const phones = user && user.phone_number
        ? `+(${user.phone_number.country_code}) ${user.phone_number.phone_number}` : '';
    return (
        <View style={{ flex: 1, alignSelf: 'center' }}>
          <Text style={styles.name}>
            {names}
          </Text>
          <Text style={styles.phoneSmall}>
            {phones}
          </Text>
        </View>
    );
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

  getAvatar = (item) => {
    const sender = item.from_user;
    const receiver = item.to_user;
    switch (item.type) {
        // receive
      case 0:
        return sender.avatar.url;
        // sent
      case 1:
        return receiver.avatar.url;
      default:
        return null;
    }
  };

  showDivider = () => (
      <View style={styles.divider} />
  );

  renderCredentials(user, item) {
    if (user !== null) {
      if (user.person && (user.person.first_name || user.person.last_name)) {
        return this.renderNameWithPhone(user);
      }
      return this.renderPhone(user);
    }
    return this.renderWallet(item);
  }

  renderWallet = (item) => {
    const wallet = item.from_address;
    return (
        <View style={{ flex: 1, alignSelf: 'center' }}>
          <Text style={styles.phone}>
            {wallet}
          </Text>
        </View>
    );
  };
}

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
  },
  rootContainer: {
    flexDirection: 'row',
    paddingLeft: 14,
    paddingRight: 8,
    paddingTop: 8,
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 48,
    round: 48,
  },
  image2: {
    alignSelf: 'flex-end',
    width: 20,
    height: 20,
    marginTop: -16,
    marginRight: -8,
  },
  phone: {
    color: '#1b1d1d',
    fontSize: 15,
  },
  phoneSmall: {
    color: '#1b1d1d',
    fontSize: 12,
  },
  name: {
    color: '#1b1d1d',
    fontSize: 17,
  },
  rightContainer: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  avatarContainer: {
    marginRight: 16,
  },
  statusImage: {
    width: 17,
    height: 17,
  },
  divider: {
    backgroundColor: '#f0f0f0',
    height: 0.5,
    marginTop: 16,
  },
  transactionContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  priceInt: {
    fontSize: 18,
    color: '#000000',
  },
  priceDecimal: {
    color: '#8B8B8B',
    fontSize: 15,
  },
});

export default Item;
