/* eslint-disable no-nested-ternary */
/* eslint-disable react/forbid-prop-types */

import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { colors } from '../../utils/constants';
import CustomStyleSheet from '../../utils/customStylesheet';

const ic_checked = require('../../assets/icons/ic_checked.png');
const ic_unchecked = require('../../assets/icons/ic_unchecked.png');

const ROW_HEIGHT = 64;

class ContactItem extends Component {

  static propTypes = {
    contacts: PropTypes.array,
    contactID: PropTypes.string,
    letter: PropTypes.string,
    onPress: PropTypes.func,
    mode: PropTypes.string,
    onChecked: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  componentDidMount() {}

  render() {
    const { contactID, letter, contacts, onPress, mode, onChecked } = this.props;

    const curContact = contacts.find(cnt => cnt.id === contactID);
    const contactAvatar = { uri: curContact.avatar };
    const name = curContact.name || curContact.phone;
    const offline = curContact.status === 0;

    return (
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <View style={styles.startPart}>
            <Text style={styles.groupName}> {letter} </Text>
          </View>
          <TouchableOpacity
            onPress={mode !== 'group'
              ? () => { onPress(contactID); }
              : () => { onChecked(); this.onChecked(); }}
            style={styles.itemRightContainer}
          >
            <View style={styles.imageContainer}>
              <Image resizeMode="cover" style={styles.image} source={contactAvatar} />
            </View>
            <View style={styles.centerPart}>
              <View style={styles.centerRow}>
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.contactName}>{name}</Text>
              </View>

              <View style={styles.centerRow}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={[
                    styles.statusText,
                        { color: offline ? colors.greyish : colors.cerulean },
                  ]}
                >
                  {offline ? 'offline' : 'online'}
                </Text>
                <View style={[
                  styles.statusRound,
                    { backgroundColor: offline ? colors.greyish : colors.cerulean },
                ]}
                />
              </View>

            </View>

            {mode === 'group'
                ? <View
                  style={{ alignSelf: 'center' }}
                >
                  <Image
                    style={{ height: 25, width: 25 }}
                    resizeMode="contain"
                    source={this.state.selected ? ic_checked : ic_unchecked}
                  />
                </View>
                : null
            }

          </TouchableOpacity>
        </View>
      </View>
    );
  }

  onChecked() {
    this.setState({ selected: !this.state.selected });
  }

}

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    alignItems: 'center',
  },
  itemRightContainer: {
    flex: 1,
    height: ROW_HEIGHT,
    marginRight: 16,
    marginLeft: 10,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.purpley_grey,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ROW_HEIGHT,
    width: 52,
    marginRight: 16,
  },
  image: {
    height: 52,
    width: 52,
    borderRadius: 100,
    marginTop: 2,
    marginBottom: 2,
  },
  inOutHmq: {
    width: 18,
    height: 18,
  },
  centerPart: {
    marginTop: 7,
    marginBottom: 7,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  startPart: {
    marginTop: 7,
    marginBottom: 7,
    flexDirection: 'column',
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  groupName: {
    fontFamily: 'Roboto',
    fontSize: 24,
    textAlign: 'left',
    color: colors.warm_grey_three,
  },
  contactName: {
    fontFamily: 'Roboto',
    fontSize: 18,
    letterSpacing: -0.1,
    textAlign: 'left',
    color: 'black',
  },
  statusText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    letterSpacing: 0.2,
    textAlign: 'left',
  },
  statusRound: {
    marginTop: 3,
    marginLeft: 3,
    height: 7,
    width: 7,
    borderRadius: 4,
  },
});


const mapStateToProps = state => ({
  contacts: state.contacts,
});

export default connect(mapStateToProps)(ContactItem);
