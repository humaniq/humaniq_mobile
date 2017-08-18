import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  StatusBar,
  Text,
  TextInput,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import { HumaniqContactsApiLib, HumaniqProfileApiLib } from 'react-native-android-library-humaniq-api';
import { connect } from 'react-redux';
import CustomStyleSheet from '../../utils/customStylesheet';
import { newTransaction, addContacts } from '../../actions';
import ContactItem from './ContactItem';
import { colors } from '../../utils/constants';

const ic_back_white = require('../../assets/icons/back_white.png');
const ic_search = require('../../assets/icons/search_white.png');
const ic_close_white = require('../../assets/icons/ic_close_white.png');
const ic_contacts = require('../../assets/icons/two_person_dark.png');
const ic_big_check_blue = require('../../assets/icons/ic_big_check_blue.png');
const ic_done = require('../../assets/icons/done_white.png');

const getName = cnt => cnt.name || cnt.phone || ' ';
const nameSort = (a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};
const sort = (a, b) => nameSort(getName(a), getName(b));

export class ChatContacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      text: '',
      groupArray: [],
      checkedItems: [],
      tempArray: [],
      showEmptyView: false,
    };
  }

  contacts = this.props.contacts

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

  componentDidMount() {
    const { navigation: { state }, setRootScreen, newContacts } = this.props;
    // get all contacts
    HumaniqContactsApiLib.extractAllPhoneNumbers()
      .then((response) => {
        // console.log('contacts.ok--->', JSON.stringify(response));
        const accs = response.map(acc => acc.accountId);
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
                    selected: false,
                  };
                });
                forAdd.sort((prevItem, nextItem) => this.compareArrays(prevItem, nextItem));
                console.log(forAdd);
                newContacts(forAdd);
              })
              .catch((/* err */) => {
                // console.log('profiles.err--->', JSON.stringify(err));
              });
        } catch (e) {
          // console.log(e);
        }
      })
      .catch((err) => {
        console.warn(JSON.stringify(err));
      });
  }

  compareArrays(prevItem, nextItem) {
    if (prevItem.name < nextItem.name) { return -1; }
    if (prevItem.name > nextItem.name) { return 1; }
    return 0;
  }

  render() {
    const { mode } = this.props.navigation.state.params;
    const { search, text, showEmptyView } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#598fba"
        />
        {this.renderHeader(mode)}
        {mode === 'contacts'
            ? <View style={styles.subToolbar}>
              <Image
                resizeMode="contain"
                source={ic_contacts}
                style={{ height: 24, width: 24 }}
              />
            </View>
            : null
        }

        {this.renderContent(mode)}
      </View>
    );
  }

  renderContent(mode) {
    const { search, text, contacts, showEmptyView } = this.state;

    const filter = cnt => (search && text ? getName(cnt).toUpperCase().indexOf(text.toUpperCase()) >= 0 : true);
    const groupLetter = '';

    return (
      <View style={{ backgroundColor: colors.white, flex: 1 }}>
        {this.getContacts(filter, groupLetter, mode)}
      </View>
    );
  }

  selectItem = (id) => {
    this.setState({
      search: false,
      text: '',
    });
    // navigate('SelectAmount');
  };

  renderHeader(mode) {
    const { search, checkedItems } = this.state;
    return (
      <View style={styles.toolbar}>
        {this.renderBackButton(search, mode)}

        <TouchableNativeFeedback
          onPress={() => this.onSearch(search)}
          delayPressIn={0}
          background={TouchableNativeFeedback.SelectableBackground()}
        >
          <View style={styles.item}>
            <Image
              source={!search ? ic_search : ic_close_white}
            />
          </View>
        </TouchableNativeFeedback>

        {mode === 'group'
            ? <TouchableNativeFeedback
              onPress={checkedItems.length > 0 ? () => this.onSearch(search) : null}
              delayPressIn={0}
              background={TouchableNativeFeedback.SelectableBackground()}
            >
              <View style={styles.item}>
                <Image
                  resizeMode="contain"
                  style={{ height: 25, width: 25, tintColor: checkedItems.length > 0 ? 'white' : '#A8BED1' }}
                  source={ic_done}
                />
              </View>
            </TouchableNativeFeedback>
            : null
        }

      </View>
    );
  }

  onSearch(search) {
    if (!search) {
      this.setState({
        search: true,
      });
    } else {
      this.setState({
        text: '',
      });
    }
  }

  renderBackButton(search, mode) {
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <TouchableNativeFeedback
          onPress={() => this.onBackPress(search)}
          delayPressIn={0}
          background={TouchableNativeFeedback.SelectableBackground()}
        >
          <View style={styles.item}>
            <Image
              source={ic_back_white}
            />
          </View>
        </TouchableNativeFeedback>

        {!search
            ? <Text style={styles.toolbarTitle}>
              {mode === 'contacts' ? 'New Chat' : 'New Group'}
            </Text>
            : <TextInput
              autoFocus
              ref="searchText"
              style={styles.search}
              placeholder="Search"
              placeholderTextColor="#A8BED1"
              underlineColorAndroid={'transparent'}
              onChangeText={text => this.setState({ text })}
              value={this.state.text}
              onSubmitEditing={() => this.startSearch()}
            />
        }

      </View>
    );
  }

  onBackPress(search) {
    if (search) {
      this.setState({
        search: false,
        text: '',
      });
    } else {
      // go back
      this.handleClose();
    }
  }

  handleClose = () => {
    const backAction = NavigationActions.back({
      key: null,
    });
    this.props.navigation.dispatch(backAction);
  }

  startSearch() {

  }

  onItemChecked(cnt) {
    const { checkedItems } = this.state;
    if (checkedItems.includes(cnt)) {
      const index = checkedItems.indexOf(cnt);
      checkedItems.splice(index, 1);
    } else {
      checkedItems.push(cnt);
    }
    this.setState({ checkedItems });
  }

  compareTwoArrays(newProps) {
    if (this.props.contacts.length === 0) { return true; }
    for (let i = 0; i < newProps.contacts.length; i++) {
      if (!newProps.contacts[i].equals(this.props.contacts[i])) { return true; }
    }
    return false;
  }


  getContacts(filter, groupLetter, mode) {
    const { search, text } = this.state;
    if (search && text && this.contacts.filter(filter).sort(sort).length === 0) {
      return (
        <View style={styles.emptyViewContainer}>
          <Text style={styles.emptyText}>No results</Text>
        </View>
      );
    }
    return (
      <ScrollView
        style={{ backgroundColor: colors.white, flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
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
            return (<ContactItem
              onPress={this.selectItem}
              letter={showLetter}
              key={cnt.id}
              contactID={cnt.id}
              mode={mode}
              onChecked={() => this.onItemChecked(cnt)}
            />);
          })}
        </View>
      </ScrollView>

    );
  }
}

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  toolbar: {
    height: 56,
    backgroundColor: '#598FBA',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 1,
  },
  item: {
    height: 56,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  toolbarTitle: {
    fontSize: 20,
    color: 'white',
    marginLeft: 8,
    alignSelf: 'center',
  },
  search: {
    flex: 1,
    fontSize: 18,
    color: 'white',
  },
  subToolbar: {
    height: 48,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0.5,
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
});

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
})(ChatContacts);
