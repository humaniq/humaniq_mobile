/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { connect } from 'react-redux';

import { colors } from '../../utils/constants';
import CustomStyleSheet from '../../utils/customStylesheet';

const SENDING = 0;
const ACCEPTED = 1;
const DELIVERED = 2;

const T_OK = 0;
const T_WAIT = 1;

const ROW_HEIGHT = 65.5;

const user1 = require('../../assets/icons/face.png');
const chats_complete = require('../../assets/icons/chats_complete.png');
const chats_accepted = require('../../assets/icons/chats_accepted.png');
const chats_wait = require('../../assets/icons/chats_wait.png');

const persons = require('../../assets/icons/two_person_dark.png');

const incoming = require('../../assets/icons/incoming.png');
const outcoming = require('../../assets/icons/outcoming.png');

const approved = require('../../assets/icons/approved.png');


class Item extends Component {

  render() {
    const { item, messages, contacts, currentIndex, size, onClick } = this.props;

    const myId = 1;
    const allMessages = messages.filter(msg => msg.chatId === item.id);
    const curMessages = allMessages.filter(msg => msg.senderId !== myId);
    const allContacts = contacts.filter(cnt => item.contactIds.includes(cnt.id));
    const curContacts = allContacts.filter(cnt => cnt.id !== myId);
    const unreadMessages = curMessages.filter(msg => msg.state !== DELIVERED);
    const lastMessage = allMessages.slice(-1)[0] || {};
    const needStatus = lastMessage.senderId === myId;
    const needHmqImage = lastMessage.type === 'hmq';
    const lastMessageText = lastMessage.text;
    const lastMessageContact = allContacts.find(cnt => cnt.id === lastMessage.senderId) || {};
    const lastMessageName = lastMessageContact.name || lastMessageContact.phone;
    const lastMessageTime = lastMessage.time;
    const lastMessageDate = lastMessageTime ? [
      lastMessageTime.getFullYear(),
      lastMessageTime.getMonth() + 1,
      lastMessageTime.getDate(),
    ].map(e => e.toString().replace(/^([0-9])$/, '0$1')).join('.') : '';
    const isGroup = item.contactIds.length > 2;
    const chatAvatar = isGroup ? user1 : { uri: curContacts[0].avatar };
    const chatName = item.groupName || curContacts.map(cnt => cnt.name || cnt.phone).join(',');
    const isApproved = !isGroup && (curContacts.slice(-1)[0] || {}).approved;

    const statusImg = lastMessage.state === DELIVERED ? chats_complete :
                      lastMessage.state === ACCEPTED ? chats_accepted :
                      chats_wait;

    const hmqImage = lastMessage.transaction === T_OK ? incoming : outcoming;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onClick} style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            <Image resizeMode="contain" style={styles.image} source={chatAvatar} />
          </View>

          <View style={styles.itemRightContainer}>
            <View style={styles.centerPart}>
              <View style={styles.centerRow}>
                {
                  isGroup ?
                    <Image style={{ width: 18, height: 12 }} source={persons} /> :
                    null
                }
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.contactName}> {chatName} </Text>
                {
                  isApproved ?
                    <Image style={{ width: 11, height: 11 }} source={approved} /> :
                    null
                }
              </View>

              <View style={styles.centerRow}>
                {
                  (!isGroup && needHmqImage) ?
                    <Image style={styles.inOutHmq} source={hmqImage} /> :
                    null
                }
                {
                  isGroup ?
                    <Text ellipsizeMode="tail" numberOfLines={1} style={styles.pre_message}> {lastMessageName}: </Text> :
                    null
                }
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.message}> {lastMessageText} </Text>
              </View>

            </View>

            <View style={styles.endPart}>
              <View style={styles.endRow}>
                {
                  needStatus ?
                    <Image style={{ width: 18, height: 18 }} source={statusImg} /> :
                    null
                }
                <Text style={styles.date}> {lastMessageDate} </Text>
              </View>
              <View style={styles.endRow}>
                {
                  unreadMessages.length ?
                    <View style={styles.unreadMessages}>
                      <Text style={styles.circle_text}> {unreadMessages.length} </Text>
                    </View> :
                    null
                }
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
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
    marginLeft: 16,
    marginRight: 16,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.purpley_grey,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 52,
    marginLeft: 16,
  },
  image: {
    height: 52,
    width: 52,
    borderRadius: 26,
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
  endPart: {
    marginTop: 7,
    marginBottom: 7,
    flexDirection: 'column',
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  contactName: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'left',
    color: '#4a4a4a',
  },
  pre_message: {
    fontFamily: 'Roboto',
    fontSize: 13,
    textAlign: 'left',
    color: colors.bluish,
  },
  message: {
    fontFamily: 'Roboto',
    fontSize: 13,
    textAlign: 'left',
    color: colors.warm_grey,
  },
  unreadMessages: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.leafy_green,
    justifyContent: 'center',
  },
  date: {
    fontFamily: 'Roboto',
    fontSize: 11,
    textAlign: 'right',
    color: colors.warm_grey_two,
  },
  circle_text: {
    fontFamily: 'Roboto',
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.white,
  },
  name: {
    color: '#1b1d1d',
    fontSize: 15,
  },
});


const mapStateToProps = state => ({
  messages: state.messages,
  contacts: state.contacts,
});

export default connect(mapStateToProps)(Item);
