import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { GiftedChat } from './GiftedChat';
import Backend from './Backend';
import CustomView from './CustomView';
import PhotoSelect from './PhotoSelect';
import SoundSelect from './SoundSelect';

const combinedShape = require('./../../assets/icons/combined_shape.png');
const icUser = require('./../../assets/icons/ic_user.png');
const voiceMessage = require('./../../assets/icons/voice_message.png');
const newTransaction = require('./../../assets/icons/new_transaction.png');
const emoji = require('./../../assets/icons/emoji.png');
const attach = require('./../../assets/icons/attach.png');

const time = Date.now();
const name = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
const num = Math.round(Math.random() * 100);
const user1 = {
  _id: time,
  name: `${name} ${num}`,
  // avatar: 'http://findicons.com/files/icons/1072/face_avatars/300/a02.png',
};

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      time: 0,
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;

    this.photoSelectRef = null;
    this.soundSelectRef = null;
  }

  componentWillMount() {
    this._isMounted = true;
    Backend.loadMessages((message) => {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, message),
        };
      });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState(previousState => ({
          messages: GiftedChat.prepend(previousState.messages, require('./data/old_messages.js')),
          loadEarlier: false,
          isLoadingEarlier: false,
        }));
      }
    }, 1000); // simulating network
  }

  onSend(message) {
    Backend.sendMessage(message.map(m => ({ ...m, user: user1 })));
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  renderFooter(props) {
    const handleAttach = () => {
      this.photoSelectRef.setModalVisible(true);
    };
    const handleSound = () => {
      this.soundSelectRef.setModalVisible(true);
    };
    const CustomBtn = props => (
      <TouchableOpacity onPress={props.onPress} style={styles.btn}>
        <Image source={props.src} style={styles.imgBtn} />
      </TouchableOpacity>
    );

    return (
      <View style={styles.panelContainer}>
        <CustomBtn onPress={handleAttach} src={attach} />
        <PhotoSelect onSend={this.onSend} ref={(r) => { this.photoSelectRef = r; }} />
        <CustomBtn onPress={this.handleEmoji} src={emoji} />
        <CustomBtn onPress={this.handleTransaction} src={newTransaction} />
        <CustomBtn onPress={handleSound} src={voiceMessage} />
        <SoundSelect onSend={this.onSend} ref={(r) => { this.soundSelectRef = r; }} />
      </View>
    );

    /*
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
    */
  }

  render() {
    console.log(this.props);

    return (
      <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
        <View style={styles.navbar}>
          <View style={{ width: 60, flex: 0.5, alignItems: 'flex-start' }}>
            <TouchableOpacity
              onPress={() => alert('back')}
              style={{ padding: 10 }}
            >
              <Image source={combinedShape} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>{'+375295738689'}</Text>
          </View>
          <View style={{ width: 60, flex: 0.5, alignItems: 'flex-end' }}>
            <Image style={{ margin: 10 }} source={icUser} />
          </View>
        </View>
        <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            // loadEarlier={this.state.loadEarlier}
            // onLoadEarlier={this.onLoadEarlier}
            // isLoadingEarlier={this.state.isLoadingEarlier}

            user={user1}
            renderBubble={this.renderBubble}
            renderCustomView={this.renderCustomView}
            renderChatFooter={this.renderFooter}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  navbar: {
    height: 60,
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
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  panelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: '#9b9b9b',
    borderTopWidth: 1,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // padding: 20,
    backgroundColor: 'gray',
    borderWidth: 2,
  },
  recordingTime: {
    fontSize: 20,
    color: 'red',
  },
  btn: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 7,
    paddingBottom: 7,
  },
  imgBtn: {
    width: 40,
    height: 40,
  },
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Chat);
