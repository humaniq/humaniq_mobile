import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  StatusBar,
  Animated,
  ToolbarAndroid,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  RefreshControl,
  ListView,
  ScrollView,
  DeviceEventEmitter,
  Alert,
  BackHandler,
} from 'react-native';
import CustomStyleSheet from '../../utils/customStylesheet';

import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { HumaniqProfileApiLib, HumaniqTokenApiLib } from 'react-native-android-library-humaniq-api';
import moment from 'moment';
import Item from './Item';
import * as constants from './utils/constants';
import TransactionsModal from './modals/TransactionsModal';
import TransactionConfirmModal from './modals/TransactionConfirmModal';
import Fab from './shared/Fab';
import * as actions from '../../actions/index';

const HEADER_MAX_HEIGHT = 160;
const DELTA = 20;
const TOOLBAR_HEIGHT = 56;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - TOOLBAR_HEIGHT;

const ic_close_black = require('../../assets/icons/ic_close_black.png');
const ic_incoming_transaction = require('../../assets/icons/ic_incoming.png');
const ic_outgoing_transaction = require('../../assets/icons/ic_payment.png');
const ic_back_white = require('../../assets/icons/ic_back_white.png');
const ic_settings_white = require('../../assets/icons/ic_settings_white.png');
const ic_fab = require('../../assets/icons/ic_fab_money.png');
const ic_empty = require('../../assets/icons/ic_profile_feed.png');
const ic_photo_holder = require('../../assets/icons/ic_mock.png');

export class Profile extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
    profile: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = {
      scrollY: new Animated.Value(0),
      modalVisibility: false,
      newTransactionModalVisibility: false,
      confirmTransactionVisibility: false,
      item: {},
      // TODO get user from props (redux)
      user: {
        status: 1, // 1 - online, 0 - offline
      },
      balance: {
        token: {
          currency: 'HMQ',
          amount: '',
        },
        price: {
          currency: 'USD',
          amount: '',
        },
      },
      transactions: [],
      refreshing: false,
      dataSource: ds.cloneWithRowsAndSections(this.convertToMap([])),
      itemAnimated: new Animated.Value(0),
      newTransaction: {},
      rate: 0,
      transactionsId: [],
    };
  }

  offset = 0
  limit = 10
  activity = true
  divideBy = 100000000

  convertToMap = (array) => {
    const categoryMap = {};
    array.forEach((item) => {
      const category = moment.unix(item.timestamp).format('DD.MM.YYYY').toString();
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(item);
    });

    return categoryMap;
  };

  animateItem = () => {
    Animated.timing(this.state.itemAnimated, {
      toValue: 1,
      duration: 1000,
    }).start();
  };

  componentWillMount() {
    console.log('profile_id', this.props.id);
    DeviceEventEmitter.addListener('EVENT_TRANSACTION_ERROR', (event) => {
      console.log('ошибка');
      console.log(event);
      if (this.activity && event) {
        const error = JSON.parse(event.error);
        if (this.isTransactionIdExist(error)) {
          Alert.alert(null, error.error, [
            {
              text: 'Ok',
              onPress: () => {
              },
            },
          ]);
        }
      }
    });

    this.setState({ refreshing: true });
    // first call transactions and balance
    this.getUserInfo();
    this.getTransactions(false);
    this.getBalance();
    this.getExchangeValue();

    // add listener to listen transactions status changes
    DeviceEventEmitter.addListener('EVENT_TRANSACTION_CHANGED', (event) => {
      console.log('push::', event);
      HumaniqProfileApiLib.getUserTransaction(this.props.id, event.hash)
          .then((resp) => {
            console.log('get transcation event::', event);
            this.getBalance();
            if (this.activity) {
              if (!this.isTransactionExist(resp)) {
                const tempTransactions = this.state.transactions;
                tempTransactions.push(resp);
                tempTransactions.sort((prevItem, nextItem) => this.compareTransactions(prevItem, nextItem));
                const map = this.convertToMap(tempTransactions);
                this.setState({
                  transactions: tempTransactions,
                  dataSource: this.state.dataSource.cloneWithRowsAndSections(map),
                });
              }
            }
          });
    });
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newTransaction && nextProps.newTransaction.amount !== 0) {
      const { newTransaction } = nextProps;
      this.setState({ newTransaction, confirmTransactionVisibility: true });
    }
  }

  getUserInfo() {
    HumaniqProfileApiLib.getAccountProfile(this.props.id)
        .then((response) => {
          if (this.activity) {
            if (response.code === 401) {
              this.navigateTo('Tutorial');
            } else {
              this.props.setProfile(response);
            }
          }
        })
        .catch((err) => {
          console.log('get user info error: ',err);
        });
  }

  navigateTo = (screen, params) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: screen, params })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  getBalance() {
    // get Balance
    HumaniqProfileApiLib.getBalance(this.props.id)
        .then((addressState) => {
          if (this.activity) {
            if (addressState.code === 401) {
              this.navigateTo('Tutorial');
            } else {
              const { balance } = this.state;
              if (addressState) {
                balance.token.currency = addressState.token.currency;
                balance.token.amount = (parseFloat(addressState.token.amount / this.divideBy)).toString();
                // if local currency is null, use default currency
                if (addressState.local) {
                  balance.price.currency = addressState.local.currency;
                  balance.price.amount = (parseFloat(addressState.local.amount / this.divideBy)).toString();
                } else {
                  balance.price.currency = addressState.default.currency;
                  balance.price.amount = (parseFloat(addressState.default.amount / this.divideBy)).toString();
                }
              }
              this.setState({ balance });
            }
          }
        })
        .catch((err) => {
          // handle error
          console.log(err);
        });
  }

  handleClose = () => {
    const backAction = NavigationActions.back({
      key: null,
    });
    this.props.navigation.dispatch(backAction);
  }

  getTransactions(shouldRefresh, initial) {
    // get Transactions
    HumaniqProfileApiLib.getTransactions(
        this.props.id,
        initial ? 0 : this.state.transactions.length,
        this.limit,
    )
        .then((array) => {
          const oldArray = this.state.transactions;
          if (this.activity) {
            let newArray = [];
            if (shouldRefresh) {
              newArray = array;
            } else {
              newArray = oldArray.concat(array);
            }
            const map = this.convertToMap(newArray);
            this.setState({
              transactions: newArray,
              dataSource: this.state.dataSource.cloneWithRowsAndSections(map),
              refreshing: false,
            });
          }
        })
        .catch((err) => {
          // handle error
          console.log(err);
          this.setState({ refreshing: false });
        });
  }

  // animation in order to make collapse effects
  getAnimationType = (type) => {
    switch (type) {
      case constants.HEADER_TRANSLATE:
        return this.state.scrollY.interpolate({
          inputRange: [0, HEADER_SCROLL_DISTANCE],
          outputRange: [0, -HEADER_SCROLL_DISTANCE],
          extrapolate: 'clamp',
        });
      case constants.HEADER_TRANSLATE2:
        return this.state.scrollY.interpolate({
          inputRange: [0, HEADER_SCROLL_DISTANCE],
          outputRange: [0, HEADER_SCROLL_DISTANCE],
          extrapolate: 'clamp',
        });
      case constants.VIEW_TRANSLATE:
        return this.state.scrollY.interpolate({
          inputRange: [0, HEADER_SCROLL_DISTANCE],
          outputRange: [1, 0.7],
          extrapolate: 'clamp',
        });
      case constants.VIEWY_TRANSLATE:
        return this.state.scrollY.interpolate({
          inputRange: [0, HEADER_SCROLL_DISTANCE],
          outputRange: [0, DELTA + (0.7 * DELTA)],
          extrapolate: 'clamp',
        });
      case constants.IMAGE_OPACITY:
        return this.state.scrollY.interpolate({
          inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        });
      default:
        return '';
    }
  };

  render() {
    const { user, balance } = this.state;
    const { profile } = this.props;
    // break amount into two values to use them separately
    const hmqInt = balance && balance.token && balance.token.amount
        ? balance.token.amount.toString().split('.')[0] : '0';
    const hmqDec = balance && balance.token && balance.token.amount
        ? balance.token.amount.toString().split('.')[1] : '00';
    // break amount into two values to use them separately
    const currencyInt = balance && balance.price && balance.price.amount
        ? balance.price.amount.toString().split('.')[0] : '0';
    const currencyDec = balance && balance.price && balance.price.amount
        ? balance.price.amount.toString().split('.')[1] : '00';

    return (
      <View style={styles.mainContainer}>
        {/* render status bar */}
        <StatusBar
          backgroundColor="#598FBA"
        />
        {/* render list */}
        { this.state.transactions.length > 0 ? this.renderContent() : this.renderEmptyView()}
        {/* render collapse layout */}
        <Animated.View
          style={[styles.collapseContainer, {
            transform: [{ translateY: this.getAnimationType(constants.HEADER_TRANSLATE) }],
          }]}
        >
          <Animated.View
            style={[styles.bar, {
              transform: [
                    { scale: this.getAnimationType(constants.VIEW_TRANSLATE) },
                    { translateY: this.getAnimationType(constants.VIEWY_TRANSLATE) },
              ],
            }]}
          >
            <Animated.View
              style={styles.avatarInfoContainer}
            >
              <Animated.Image
                style={styles.avatar}
                source={profile.avatar ? { uri: profile.avatar.url } : ic_photo_holder}
              />
              <Animated.View style={styles.infoContainer}>
                <Text style={styles.title}>{`${hmqInt}.`}
                  <Text style={styles.titleDec}>
                    {hmqDec || '00'} {balance.token.currency}
                  </Text>
                </Text>
                <Text style={styles.titleDec2}>
                  {`${currencyInt}.`}{currencyDec || '00'} {balance.price.currency}
                </Text>
              </Animated.View>
            </Animated.View>
          </Animated.View>
          {/* render toolbar */}
          <Animated.View style={[{
            transform: [{ translateY: this.getAnimationType(constants.HEADER_TRANSLATE2) }],
          }]}
          >
            <ToolbarAndroid
              onActionSelected={position => this.onActionClick(position)}
              style={{
                height: TOOLBAR_HEIGHT,
                backgroundColor: 'transparent',
                marginLeft: 5,
                marginRight: 5,
              }}
              actions={[{
                title: '',
                icon: ic_settings_white,
                show: 'always',
              }]}
            />
          </Animated.View>
        </Animated.View>
        {/* render fab button */}
        {this.renderFabButton()}
        {/* render transaction modal */}
        {this.showTransactionsModal()}
        {this.showNewTransactionsModal()}
        {this.state.confirmTransactionVisibility ? this.showConfirmTransactionModal() : null}
      </View>
    );
  }

  backButtonHandle = () => {
    this.handleClose();
  };

  renderRow = child => (
    <Item
      item={child}
      currentIndex={0}
      size={2}
      onClick={() => this.onItemClick(child)}
    />
  );

  renderSectionHeader = (map, category) => (
    <Text style={[styles.headerSection]}>
      {category}
    </Text>
  );

  _onRefresh() {
    this.setState({ refreshing: true });
    this.getTransactions(true, true);
    this.getBalance();
    this.getUserInfo();
    this.getExchangeValue();
  }

  settingsButtonHandle = () => {
    const navState = this.props.navigation.state;
    this.props.navigation.navigate('ProfileSettings', { ...navState.params, user: this.state.user });
  };

  // on fab button click handler
  onFabButtonPress = () => {
    // show newTransactionModal
    this.setState({ newTransactionModalVisibility: true });
  };

  onEndReached() {
    this.getTransactions(false);
  }

  renderContent = () => (
    <ListView
      enableEmptySections
      onEndReachedThreshold={14}
      onEndReached={() => this.onEndReached()}
      dataSource={this.state.dataSource}
      renderHeader={() => <View style={{ marginTop: HEADER_MAX_HEIGHT }} />}
      renderRow={this.renderRow}
      renderSectionHeader={this.renderSectionHeader}
      style={{
        backgroundColor: '#fff',
      }}
      showsVerticalScrollIndicator={false}
      onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
          )}
      refreshControl={
        <RefreshControl
          progressViewOffset={150}
          refreshing={this.state.refreshing}
          onRefresh={() => this._onRefresh()}
        />
          }
    />
  );

  // render Empty View, if array is empty
  renderEmptyView = () => (
    <ScrollView
      contentContainerStyle={{ backgroundColor: '#fff', flex: 1, alignItems: 'center', justifyContent: 'center' }}
      refreshControl={
        <RefreshControl
          progressViewOffset={150}
          refreshing={this.state.refreshing}
          onRefresh={() => this._onRefresh()}
        />
          }
    >
      <View style={styles.emptyViewContainer}>
        <Image
          resizeMode="contain"
          style={styles.emptyImage}
          source={ic_empty}
        />
      </View>

    </ScrollView>
  );

  // on transaction item click handler
  onItemClick = (item) => {
    this.setState({
      item,
      modalVisibility: true,
    });
  };

  // on chat icon click handler
  onChatClick = () => {
    this.setState({
      modalVisibility: false,
    });
  };

  // rendering fab button
  renderFabButton = () => (
    <Fab
      onClick={() => this.onFabButtonPress()}
      source={ic_fab}
      scroll={this.state.scrollY}
      opacity={this.getAnimationType(constants.IMAGE_OPACITY)}
    />);

  // to load more data
  loadMoreData() {
    this.getTransactions();
  }

  componentWillUnmount() {
    // to prevent null pointers
    this.activity = false;
    // DeviceEventEmitter.removeListener('EVENT_TRANSACTION_ERROR');
    // DeviceEventEmitter.removeListener('EVENT_TRANSACTION_CHANGED');
    // DeviceEventEmitter.removeAllListeners()
  }

  // toolbar action click handler
  onActionClick = (position) => {
    switch (position) {
      case 0:
        return this.settingsButtonHandle();
      default:
        return '';
    }
  };

  showConfirmTransactionModal() {
    return (
      <TransactionConfirmModal
        onCancelClick={() => {
          this.emptyTransaction();
          this.setState({ confirmTransactionVisibility: false });
        }}
        onClick={() => this.onTransactionConfirmClick()}
        item={this.state.newTransaction}
        visibility={this.state.confirmTransactionVisibility}
        contacts={this.props.contacts}
      />
    );
  }

  showTransactionsModal() {
    return (
      <TransactionsModal
        onCancelClick={() => this.setState({ modalVisibility: false })}
        onChatClick={() => this.onChatClick()}
        item={this.state.item}
        visibility={this.state.modalVisibility}
        currency={this.state.balance.price.currency}
        rate={this.state.rate}
      />
    );
  }

  showNewTransactionsModal() {
    return (
      <Modal
        style={{ margin: 0 }}
        isVisible={this.state.newTransactionModalVisibility}
      >
        <TouchableWithoutFeedback onPress={() => this.dismissModal()}>
          <View style={styles2.rootContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles2.content}>

                <View style={styles2.imageContainer}>
                  {/* <TouchableNativeFeedback onPress={() => this.dismissModal()}> */}
                  {/* <View style={styles.transactionImageContainer}> */}
                  {/* <Image source={ic_incoming_transaction} /> */}
                  {/* </View> */}
                  {/* </TouchableNativeFeedback> */}

                  <TouchableNativeFeedback onPress={() => this.openTransactionCreate()}>
                    <View style={styles2.transactionImageContainer}>
                      <Image source={ic_outgoing_transaction} />
                    </View>
                  </TouchableNativeFeedback>
                </View>

                <View style={{ backgroundColor: '#e0e0e0', height: 1 }} />
                <TouchableNativeFeedback onPress={() => this.dismissModal()}>
                  <View style={styles2.closeButtonContainer}>
                    <Image source={ic_close_black} />
                  </View>
                </TouchableNativeFeedback>
              </View>
            </TouchableWithoutFeedback>

          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  dismissModal() {
    this.setState({ newTransactionModalVisibility: false });
  }

  isTransactionExist(push) {
    const tempTransactions = this.state.transactions;
    for (let i = 0; i < tempTransactions.length; i += 1) {
      if (tempTransactions[i].transaction === push.transaction) {
        tempTransactions[i] = push;
        this.setState({
          transactions: tempTransactions,
          dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertToMap(tempTransactions)),
        });
        return true;
      }
    }
    return false;
  }

  compareTransactions(prevItem, nextItem) {
    if (prevItem.timestamp > nextItem.timestamp) { return -1; }
    if (prevItem.timestamp < nextItem.timestamp) { return 1; }
    return 0;
  }

  openTransactionCreate() {
    this.emptyTransaction();
    this.setState({ newTransactionModalVisibility: false });
    const navState = this.props.navigation.state;
    this.props.navigation.navigate('Choose', { ...navState.params });
  }

  onTransactionConfirmClick() {
    const { newTransaction, transactionsId } = this.state;

    let toUserId = null;
    let toUserAddress = null;
    if (newTransaction.contactID !== 0 && newTransaction.contactID !== '') {
      toUserId = newTransaction.contactID;
    } else if (newTransaction.adress) {
      toUserAddress = newTransaction.adress;
    }

    HumaniqProfileApiLib.createTransaction(this.props.id, toUserId, toUserAddress, (newTransaction.amount * 100000000))
        .then((resp) => {
          if (resp.code === 401) {
            this.navigateTo('Tutorial');
          } else {
            // do your stuff
            console.log('create transaction::', resp);
            transactionsId.push(resp);
            this.setState({ transactionsId });
          }
        })
        .catch((err) => {
          // handle error
          console.log('create transaction error::', err);
        });
    this.emptyTransaction();
    this.setState({ confirmTransactionVisibility: false });
  }

  emptyTransaction() {
    this.props.setAmount(0);
    this.props.setAddress('');
    this.props.setPhone('');
    this.props.setContact(0);
  }

  getExchangeValue() {
    HumaniqProfileApiLib.getExchangeUsd('1').then((data) => {
      if (this.activity) {
        const { USD = 0 } = data;
        this.setState({
          rate: USD,
        });
      }
    });
  }

  isTransactionIdExist(error) {
    if (error !== null) {
      const transactionsId = this.state.transactionsId;
      for (let i = 0; i < transactionsId.length; i += 1) {
        if (transactionsId[i].transactionId === error.transaction_id) {
          return true;
        }
      }
    }
    return false;
  }
}

const styles2 = CustomStyleSheet({
  rootContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  content: {
    backgroundColor: '#ffffff',
    height: 250,
    justifyContent: 'flex-end',
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
  closeButtonContainer: {
    padding: 15,
    alignItems: 'center',
  },
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  collapseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#598fba',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  avatarInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 65,
  },
  infoContainer: { marginLeft: 13 },
  bar: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: DELTA,
  },
  title: {
    color: 'white',
    fontSize: 28,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
    backgroundColor: '#fff',
  },
  backButton: {
    marginLeft: 16,
  },
  settingsButton: {
    marginRight: 16,
  },
  headerSection: {
    marginLeft: 16.5,
    marginTop: 33,
    marginBottom: 13,
    color: '#2586C6',
    fontSize: 16.5,
    fontWeight: '500',
  },
  back: {
    height: 24,
    width: 24,
  },
  settings: {
    height: 24,
    width: 24,
  },
  toolbar: {
    height: TOOLBAR_HEIGHT,
    backgroundColor: 'transparent',
  },
  emptyViewContainer: {
    marginTop: HEADER_MAX_HEIGHT,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
  },
  priceInt: {
    fontSize: 16,
    color: '#000000',
  },
  priceDecimal: {
    color: '#8B8B8B',
    fontSize: 14,
  },

  rootContainer: {
    justifyContent: 'flex-end',
    flex: 1,
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
  titleDec: {
    fontSize: 17.5,
    color: '#DAE5EE',
  },
  titleDec2: {
    fontSize: 16,
    color: '#DAE5EE',
    marginTop: 3,
  },
});

export default connect(
    state => ({
      user: state.user,
      profile: state.user.profile || {},
      id: state.user.account.payload.payload.account_id || state.accounts.primaryAccount.accountId,
      acc: state.accounts.primaryAccount,
      newTransaction: state.newtransaction,
      contacts: state.contacts,
    }),
    dispatch => ({
      setProfile: profile => dispatch(actions.setProfile(profile)),
      setAmount: amount => dispatch(actions.newTransaction.setTrAmount(amount)),
      setAddress: address => dispatch(actions.newTransaction.setTrAdress(address)),
      setPhone: phone => dispatch(actions.newTransaction.setTrAdress(phone)),
      setContact: contact => dispatch(actions.newTransaction.setTrAdress(contact)),
    }),
)(Profile);
