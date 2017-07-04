import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

import CustomStyleSheet from '../../utils/customStylesheet';

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  navbar: {
    height: 40,
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 2,
    borderColor: '#9b9b9b',
    borderBottomWidth: 1,
  },
  userPhoto: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  phoneNumber: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  closeBtn: {
    padding: 10,
    alignSelf: 'flex-start',
  },
  camera: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
  },
  captureContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
  },
  captureBtn: {
    round: 50,
    borderRadius: 55,
    borderWidth: 5,
  },
  uploadBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import {
  AccountManager,
  SignalConnectionService,
  SignalServiceMessagePipe,
} from 'humaniq-libsignals';

const combinedShape = require('../../assets/icons/combined_shape.png');
const icUser = require('../../assets/icons/ic_user.png');

const user1 = {
  _id: 1,
  name: 'User 1',
  avatar: 'http://findicons.com/files/icons/1072/face_avatars/300/a02.png',
};

const user2 = {
  _id: 2,
  name: 'User 2',
  avatar: 'http://icons.iconarchive.com/icons/hopstarter/face-avatars/256/Female-Face-FB-1-icon.png',
};


export default class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = { verifyValue: '', isChat: false, messages: [] };
  }

  verificationCode = '';
  signalConnectionService = null;
  accountManager = null;
  signalPipe = null;
  signalServiceMessagePipe = null;
  onSend = o => console.log(o)

  async handleMessages() {
    this.signalServiceMessagePipe = await new SignalServiceMessagePipe(this.signalPipe.descriptor, this.signalConnectionService);
    console.log('created pipe');
    let listenMessages = true;

    // SignalModuleAndroid.handleReceiveMessages();

    while (listenMessages) {
      try {

        setTimeout(() => { this.signalConnectionService.sendMessage('+375295738689', 'Hello world!', []);console.log('--->') }, 3000);
        const message = await this.signalServiceMessagePipe.readMessage(10);
        console.log('read message');
        if (message !== null) console.log(message);
      } catch (e) {
        console.log(e.message);
        //await this.signalServiceMessagePipe.shutdownPipe();
        listenMessages = false;
        console.log('shutdown pipe');
      }
    }
  }
  // <View style={{ zIndex: 2, borderColor: '#9b9b9b', borderBottomWidth: 1,
  // position: 'absolute', left: 0, right: 0, height: 80 }}><Text>OK</Text></View>

  onSend = (messages = []) => {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  renderChat = () => (
    <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => this.setState({ isChat: false })}
        >
          <Image source={combinedShape} />
        </TouchableOpacity>
        <View style={styles.phoneNumber}>
          <Text>{'+375295738689'}</Text>
        </View>
        <Image style={styles.userPhoto} source={icUser} />
      </View>
      <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
        <GiftedChat
          renderAvatarOnTop
          messages={this.state.messages}
          onSend={this.onSend}
          user={user1}
        />
      </View>
    </View>
  )
  renderReg = () => (<View style={styles.container}>
    <Text style={styles.welcome}>Welcome to Chat Testing!</Text>
    <Button
      title="Register"
      style={{ marginTop: 10, marginBottom: 10 }}
      onPress={async () => {
        console.log('ok');
        this.accountManager = await AccountManager.createInstance(
            'https://beta-api.humaniq.co/signal',
            //'https://textsecure-service-staging.whispersystems.org:80',
            '+375295738689',
            // '+79137698347',
            // "+79639467632",
            // "+79529262362",
            '123456',
            'OWF',
          );
        console.log('created account', this.accountManager);
        await this.accountManager.requestSmsVerificationCode();
        console.log('requested', this.accountManager);
      }}
    />

    <TextInput
      ref={(el) => {
        this.verificationCode = el;
      }}
      style={{
        height: 40,
        width: 100,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
      }}
      onChangeText={verifyValue => this.setState({ verifyValue })}
      value={this.state.verifyValue}
    />
    <Button
      title="Verify"
      style={{ marginTop: 10, marginBottom: 10 }}
      onPress={async () => {
        console.log(this.state.verifyValue, this.accountManager);

        await this.accountManager.verifyAccountWithCode(
          this.state.verifyValue,
        ).catch(e => console.log(e));

        console.log('verified');

          // await SignalModuleAndroid.initAccount();
          // console.log("inited account");
      }}
    />

    <Button
      title="Init"
      style={{ marginTop: 10, marginBottom: 10 }}
      onPress={async () => {
        await this.accountManager.initAccount();
        this.signalConnectionService =
        await SignalConnectionService.createInstance(this.accountManager);

        this.signalPipe =
        await this.signalConnectionService.createPipe();
        console.log('inited account');
      }}
    />

    <Button
      title="Reveive messages"
      onPress={async () => {
        await this.handleMessages();
      }}
    />
    <Button
      title="Send message"
      style={{ marginTop: 10, marginBottom: 10 }}
      onPress={async () => {
        // +79639467632
        await this.signalConnectionService.sendMessage('+375295738689', 'Hello world!', []);
        console.log('text message was sent');
      }}
    />
    <Button title="Go to Chat" style={{ marginTop: 10, marginBottom: 10 }} onPress={() => {
      this.setState({ isChat: true, messages: [
        {
          _id: 5,
          text: 'Давай к нам',
          createdAt: new Date(Date.UTC(2017, 5, 30, 5, 27, 31)),
          user: user2,
        },
        {
          _id: 4,
          text: 'Фигасе!!!!',
          createdAt: new Date(Date.UTC(2017, 5, 30, 5, 25, 16)),
          user: user1,
        },
        {
          _id: 3,
          text: 'Глянь где я',
          image: 'https://files1.adme.ru/files/news/part_79/793310/10095010-797ab841d30ecf2e893c6ff55e0e067a_970x-1000-224ec000e1-1484579184.jpg',
          createdAt: new Date(Date.UTC(2017, 5, 30, 5, 22, 50)),
          user: user2,
        },
        {
          _id: 1,
          text: 'Привет',
          createdAt: new Date(Date.UTC(2017, 5, 30, 5, 20, 24)),
          user: user1,
        },
        {
          _id: 2,
          text: 'Привет. Как у тебя дела?',
          createdAt: new Date(Date.UTC(2017, 5, 30, 5, 19, 33)),
          user: user2,
        },
      ] });
    }} />
  </View>)

  render() {
    return this.state.isChat ? this.renderChat() : this.renderReg();
  }
}
