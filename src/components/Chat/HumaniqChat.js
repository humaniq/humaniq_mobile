import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, ScrollView, TextInput } from 'react-native';

import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'

import { colors } from '../../utils/constants';
import CustomStyleSheet from '../../utils/customStylesheet';

const backWhite = require('./../../assets/icons/back_white.png');
const callWhite = require('./../../assets/icons/call_white.png');
const moreWhite = require('./../../assets/icons/more_white.png');
const clipWhite = require('./../../assets/icons/clip_white.png');
const fabBlue = require('./../../assets/icons/fab_blue.png');
const smile = require('./../../assets/icons/smile.png');
const money = require('./../../assets/icons/money.png');

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderContent() {
    return (
      <ScrollView
        style={{ backgroundColor: colors.light_grey }}
        showsVerticalScrollIndicator={false}
      >
        {this.renderScrollViewContent()}
      </ScrollView>
    );
  }

  renderScrollViewContent() {
    const { chats, messages, navigation } = this.props;
    const { state: { params: { id } } } = navigation;
    const allMessages = messages.filter(msg => msg.chatId === id)

    const myId = 1;
    return (
      <View style={styles.scrollViewContent}>
        {allMessages.map((child, childIndex) => {
          const isLeft = child.senderId !== myId;
          return (
            <View key={child.id}>
              <View style={isLeft ? styles.leftMessage : styles.rightMessage}>
                {isLeft ? <View style={styles.leftTriangle} /> : null}
                <View style={[styles.bubble, { backgroundColor: isLeft ? colors.white : colors.very_light_green }]}>
                  <Text style={styles.messageText}>
                    {child.text}
                  </Text>
                  <Text style={styles.messageTime}>
                    16.44
                  </Text>
                </View>
                {isLeft ? null : <View style={styles.rightTriangle} />}
              </View>
            </View>
          )
        }
        )}
      </View>
    );
  }

  renderHeader() {
    const { navigation: { dispatch } } = this.props;
    return (
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => dispatch(NavigationActions.back())}>
            <Image source={backWhite} style={styles.headerImage} />
          </TouchableOpacity>
          <Image source={{ uri: 'http://lorempixel.com/200/200/cats/2/' }} style={styles.headerAvatar} />
          <View style={styles.headerStatePart}>
            <View style={styles.headerFirstRow}>
              <Text style={styles.numberText}> + 000 00 0000000 </Text>
            </View>
            <View style={styles.headerSecondRow}>
              <Text style={styles.onlineText}> online </Text>
              <View style={[styles.onlineRound, { backgroundColor: colors.apple_green }]} />
            </View>
          </View>
          <TouchableOpacity>
            <Image source={callWhite} style={styles.headerImage} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={moreWhite} style={styles.headerImage} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={clipWhite} style={styles.headerImage} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderFooter() {
    return (
      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <View style={styles.inputField}>
            <Image style={styles.smileImage} source={smile} />
            <TextInput
              placeholderTextColor={colors.pinkish_grey}
              placeholder="Type a message"
              underlineColorAndroid="transparent"
              style={styles.textInput}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
            <Image style={styles.moneyImage} source={money} />
          </View>
          <Image source={fabBlue} style={styles.fabBlue} />
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderFooter()}
      </View>
    );
  }
}

const rightTriangle = {
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderRightWidth: 14,
  borderTopWidth: 14,
  borderRightColor: 'transparent',
};

const leftTriangle = {
  ...rightTriangle,
  transform: [
    { rotate: '90deg' },
  ],
};

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    position: 'absolute',
    height: 66,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: colors.faded_blue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  headerInner: {
    marginLeft: 12,
    marginRight: 12,
    backgroundColor: colors.faded_blue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    height: 24,
    width: 24,
    margin: 4,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    margin: 4,
  },
  headerStatePart: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  numberText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
    color: colors.white,
  },
  onlineText: {
    opacity: 0.8,
    fontFamily: 'Roboto',
    fontSize: 14,
    textAlign: 'left',
    color: colors.white,
  },
  onlineRound: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginTop: 7,
  },
  headerFirstRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-start',
  },
  headerSecondRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  footer: {
    position: 'absolute',
    height: 66,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  footerInner: {
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 60,
    marginRight: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    marginTop: 9,
    fontFamily: 'Roboto',
    fontSize: 16,
    letterSpacing: 0,
    color: colors.pinkish_grey,
  },
  smileImage: {
    width: 24,
    height: 24,
    marginLeft: 11,
    marginRight: 11,
  },
  moneyImage: {
    width: 21,
    height: 18.8,
    marginLeft: 11,
    marginRight: 11,
  },
  fabBlue: {
    width: 56,
    height: 56,
  },
  scrollViewContent: {
    flex: 1,
    marginTop: 66,
    marginBottom: 66,
    backgroundColor: colors.light_grey,
  },
  leftMessage: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  rightMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  bubble: {
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 300,
    margin: 6,
  },
  messageText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 16,
    textAlign: 'left',
    color: colors.black,
    paddingLeft: 9,
    paddingRight: 9,
    paddingTop: 8,
    paddingBottom: 8,
    maxWidth: 250,
  },
  rightTriangle: {
    ...rightTriangle,
    borderTopColor: colors.very_light_green,
    top: 6,
    right: 8,
  },
  leftTriangle: {
    ...leftTriangle,
    borderTopColor: colors.white,
    top: 6,
    right: -8,
  },
  messageTime: {
    fontFamily: 'Roboto',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'right',
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 5,
    alignSelf: 'flex-end',
  },
});

const mapStateToProps = state => ({
  chats: state.chats,
  messages: state.messages,
});

export default connect(mapStateToProps)(Chat);
