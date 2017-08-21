/* eslint-disable import/no-unresolved */
/* eslint-disable react/forbid-prop-types */

import React from 'react';
import { View, TouchableOpacity, Image, Text, ScrollView, TextInput, StatusBar } from 'react-native';

import { HumaniqContactsApiLib, HumaniqProfileApiLib } from 'react-native-android-library-humaniq-api';

import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

import { colors } from '../../utils/constants';
import ChooseItem from './ChooseItem';
import { newTransaction, addContacts } from '../../actions';

const backWhite = require('./../../assets/icons/back_white.png');
const paymentBig = require('./../../assets/icons/payment_big.png');
const searchWhite = require('./../../assets/icons/search_white.png');
const closeWhite = require('./../../assets/icons/close_white.png');
const doneWhite = require('./../../assets/icons/done_white.png');
const qr = require('./../../assets/icons/qr.png');
const phoneNumber = require('./../../assets/icons/phone_number.png');
const send = require('./../../assets/icons/send.png');
const ic_big_check_blue = require('../../assets/icons/ic_big_check_blue.png');

const getName = cnt => cnt.name || cnt.phone || ' ';
const nameSort = (a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};
const sort = (a, b) => nameSort(getName(a), getName(b));

class Choose extends React.Component {

  static propTypes = {
    contacts: PropTypes.array,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      state: PropTypes.object,
    }),
    setRootScreen: PropTypes.func,
    newContacts: PropTypes.func,
    setTrContact: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedID: '',
      search: false,
      text: '',
    };
  }
  contacts = this.props.contacts

  componentDidMount() {
    const { navigation: { state }, setRootScreen, newContacts } = this.props;
    const { key = '' } = state;
    setRootScreen(key);

    HumaniqContactsApiLib.extractAllPhoneNumbers()
      .then((response) => {
        // console.log('contacts.ok--->', JSON.stringify(response));
        const accs = response.map(acc => acc.accountId);
        // console.log(JSON.stringify(accs));
        try {
          HumaniqProfileApiLib.getAccountProfiles(accs)
            .then((profiles) => {
              // console.log('profiles.ok--->', JSON.stringify(profiles));
              const forAdd = profiles.map((p) => {
                const { phone_number = {} } = p;
                const { person = {} } = p;
                const { avatar = {} } = p;
                return {
                  id: p.account_id,
                  approved: false,
                  phone: phone_number.country_code ?
                  `+(${phone_number.country_code}) ${phone_number.phone_number}` :
                  `${phone_number.phone_number}`,
                  name: `${person.first_name} ${person.last_name}`,
                  status: 1,
                  avatar: avatar.url,
                };
              });
              forAdd.sort((prevItem, nextItem) => this.compareArrays(prevItem, nextItem));
              newContacts(forAdd);
            })
            .catch((/* err */) => {
              // console.log('profiles.err--->', JSON.stringify(err));
            });
        } catch (e) {
          // console.log(e);
        }
      })
      .catch((/* err */) => {
        // console.log('contacts.err--->', JSON.stringify(err));
      });
  }

  componentWillReceiveProps(newProps) {
    // compare two arrays
    if (this.compareTwoArrays(newProps)) {
      console.log('true');
      // this.setState({
      //  contacts: newProps.contacts,
      // });
      this.contacts = newProps.contacts;
    }
  }

  compareTwoArrays(newProps) {
    if (this.props.contacts.length === 0) { return true; }
    for (let i = 0; i < newProps.contacts.length; i++) {
      if (!newProps.contacts[i].equals(this.props.contacts[i])) { return true; }
    }
    return false;
  }

  compareArrays(prevItem, nextItem) {
    if (prevItem.name < nextItem.name) { return -1; }
    if (prevItem.name > nextItem.name) { return 1; }
    return 0;
  }

  /*
  selectItem = (id) => {
    const { selectedID } = this.state;
    const newID = selectedID === id ? '' : id
    const { setTrContact, navigation: { navigate } } = this.props;
    setTrContact(newID);

    this.setState({
      selectedID: newID,
      search: false,
      text: '',
    });
  }
  */
  setSearch = () => {
    const { search, text } = this.state;
    const newValue = !search;
    this.setState({
      search: newValue,
      text: newValue === false ? '' : text,
    });
  };

  selectItem = (id) => {
    const { setTrContact, navigation: { navigate } } = this.props;
    setTrContact(id);
    this.setState({
      search: false,
      text: '',
    });
    navigate('SelectAmount');
  };

  renderContent() {
    const { contacts } = this.props;
    const { search, text } = this.state;

    const filter = cnt => (search && text ? getName(cnt).toUpperCase().indexOf(text.toUpperCase()) >= 0 : true);
    let groupLetter = '';

    return (
      <View style={{ backgroundColor: colors.white, flex: 1 }}>
        {this.getContacts(filter, groupLetter)}
      </View>
    );
  }

  getContacts(filter, groupLetter) {
    const { search, text } = this.state;
    if (search && text && this.contacts.filter(filter).sort(sort).length === 0) {
      return (
        <View style={styles.emptyViewContainer}>
          <Text style={styles.emptyText}>No results</Text>
        </View>
      );
    }
    return (
      <ScrollView style={{ backgroundColor: colors.white }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: '#F2F2F2', justifyContent: 'center', height: 42 }}>
          {!search
                ? <Image
                  style={styles.checkBlue}
                  resizeMode="contain"
                  source={ic_big_check_blue}
                />
                : <Text style={styles.checkText}>
                  CONTACTS
                </Text>
            }

        </View>
        <View style={styles.contactsHeader} />
        {this.contacts.filter(filter).sort(sort).map((cnt) => {
          const firstLetter = getName(cnt)[0];
          let showLetter = '';
          if (groupLetter !== firstLetter) {
            groupLetter = firstLetter;
            showLetter = groupLetter;
          } else {
            showLetter = '';
          }
          return <ChooseItem onPress={this.selectItem} letter={showLetter} key={cnt.id} contactID={cnt.id} />;
        })}
      </ScrollView>
    );
  }

  renderHeader() {
    const { selectedID, search } = this.state;
    const { contacts, navigation } = this.props;
    const { dispatch, navigate } = navigation;

    const curContact = contacts.find(cnt => cnt.id === selectedID) || {};
    const selName = curContact.name || curContact.phone || '';

    return (
      <View style={styles.header}>
        {search
          ? <View style={styles.headerInner}>
            <TouchableOpacity onPress={() => this.handleBackButton(dispatch, search)}>
              <Image source={backWhite} style={styles.headerImage} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.inputText}
                underlineColorAndroid="transparent"
                placeholder="Search"
                placeholderTextColor="white"
                onChangeText={text => this.setState({ text })}
                value={this.state.text}
                autoFocus
              />
            </View>
            <TouchableOpacity onPress={this.setSearch}>
              <Image source={closeWhite} style={styles.headerImage} />
            </TouchableOpacity>
          </View>
          : <View style={styles.headerInner}>
            <TouchableOpacity onPress={() => dispatch(NavigationActions.back())}>
              <Image source={backWhite} style={styles.headerImage} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Image source={paymentBig} style={styles.paymentImage} />
            </View>
            {selectedID
                ? <View style={{ flex: 3, alignItems: 'flex-start' }}>
                  <Text style={styles.selectedNum}>
                    {selName}
                  </Text>
                </View>
                : null}
            {selectedID
                ? <TouchableOpacity
                  onPress={() => {
                    this.selectItem(selectedID);
                  }}
                >
                  <Image source={closeWhite} style={styles.headerImage} />
                </TouchableOpacity>
                : null}
            <TouchableOpacity onPress={selectedID ? () => null : this.setSearch}>
              <Image source={selectedID ? doneWhite : searchWhite} style={styles.headerImage} />
            </TouchableOpacity>
          </View>}
        <View style={styles.headerButtonsRow}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigate('Camera', { mode: 'qr' })}>
            <Image source={qr} style={styles.headerImage} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate('Input', { mode: 'adress' })}
            style={[styles.headerButton, styles.borderItem]}
          >
            <Image source={send} style={styles.headerImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('Input', { mode: 'phone' })} style={styles.headerButton}>
            <Image source={phoneNumber} style={styles.headerImage} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    /*
    <StatusBar
      backgroundColor={colors.orangeish}
      barStyle="light-content"
    />

    */
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={colors.orangeish}
        />
        {this.renderHeader()}
        {this.renderContent()}
      </View>
    );
  }

  handleBackButton(dispatch, search) {
    if (search) {
      this.setState({ search: false, text: '' });
    } else {
      dispatch(NavigationActions.back());
    }
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    height: 56 + 48,
    backgroundColor: colors.orangeish,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  headerInner: {
    marginLeft: 12,
    marginRight: 12,
    height: 56,
    backgroundColor: colors.orangeish,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtonsRow: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    flex: 1,
    height: 48,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: colors.pinkish_grey,
    borderBottomColor: colors.pinkish_grey,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  borderItem: {
    borderRightColor: colors.battleship_grey,
    borderLeftColor: colors.battleship_grey,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
  },
  headerImage: {
    height: 24,
    width: 24,
    margin: 7,
  },
  paymentImage: {
    width: 38,
    height: 38,
  },
  contactsHeader: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  selectedNum: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
    color: colors.white,
  },
  inputText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: colors.white,
  },
  checkBlue: {
    width: 32,
    height: 32,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 16,
  },
  checkText: {
    color: '#4a4a4a',
    fontSize: 17,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 16,
  },
  emptyViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: 25,
    color: '#9c9c9c',
    alignSelf: 'center',
  },
};

const mapStateToProps = state => ({
  chats: state.chats,
  messages: state.messages,
  contacts: state.contacts || [],
});

export default connect(mapStateToProps, {
  newContacts: addContacts,
  setTrPhone: newTransaction.setTrPhone,
  setTrContact: newTransaction.setTrContact,
  setRootScreen: newTransaction.setRootScreen,
})(Choose);
