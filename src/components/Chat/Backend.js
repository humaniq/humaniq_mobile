/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/forbid-prop-types */

import {
  Platform,
} from 'react-native';

import firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

class Backend {
  uid = '';
  messagesRef = null;
  // initialize Firebase Backend
  // provider = new FirebaseProvider(authKeys)
  // uid = this.provider.uid
  constructor() {
    // this.provider =
    // this.uid = provider.uid ??
    const config = {
      apiKey: 'AIzaSyDMpoOtuyOCQg9VWuRKXyyy50QOKCR09fY',
      authDomain: 'humaniq1-f11d9.firebaseapp.com',
      databaseURL: 'https://humaniq1-f11d9.firebaseio.com',
      projectId: 'humaniq1-f11d9',
      storageBucket: 'humaniq1-f11d9.appspot.com',
      messagingSenderId: '755738981461',
    };
    /*
    {
      apiKey: 'AIzaSyDD4ffL5QxWARcwUTLDCm7Knahpw31EJyw',
      authDomain: 'humaniq-3c451.firebaseapp.com',
      databaseURL: 'https://humaniq-3c451.firebaseio.com',
      projectId: 'humaniq-3c451',
      storageBucket: 'humaniq-3c451.appspot.com',
      messagingSenderId: '960088281800',
    }
    */
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setUid(user.uid);
      } else {
        firebase.auth().signInAnonymously().catch((error) => {
          alert(error.message);
        });
      }
    });
  }
  setUid(value) {
    this.uid = value;
  }
  getUid() {
    return this.uid;
  }
  // retrieve the messages from the Backend
  loadMessages(callback) {
    this.messagesRef = firebase.database().ref('messages');
    this.messagesRef.off();
    const onReceive = (data) => {
      console.log('recive data', data.val());
      const message = data.val();
      if (message.text) {
        callback({
          _id: data.key,
          text: message.text,
          createdAt: new Date(message.createdAt),
          user: {
            _id: message.user._id,
            name: message.user.name,
          },
        });
      } else if (message.image) {
        callback({
          _id: data.key,
          image: message.image,
          createdAt: new Date(message.createdAt),
          user: {
            _id: message.user._id,
            name: message.user.name,
          },
        });
      } else if (message.audio) {
        callback({
          _id: data.key,
          audio: message.audio,
          createdAt: new Date(message.createdAt),
          user: {
            _id: message.user._id,
            name: message.user.name,
          },
        });
      }
    };
    this.messagesRef.limitToLast(20).on('child_added', onReceive);
  }
  // send the message to the Backend
  async sendMessage(message) {
    for (let i = 0; i < message.length; i += 1) {
      if (message[i].image) {
        console.log('🏝 message with image', message[i].image);
        const imageURI = await this.uploadImage(message[i].image);
        console.log('uri', imageURI);
        this.messagesRef.push({
          image: imageURI,
          user: message[i].user,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      } else if (message[i].text) {
        this.messagesRef.push({
          text: message[i].text,
          user: message[i].user,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      } else {
        console.log('uploading audio!!!', message[i].audio);
        const audioURI = await this.uploadAudio(message[i].audio);
        console.log('uri', audioURI);
        this.messagesRef.push({
          audio: audioURI,
          user: message[i].user,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }
    }
  }
  // close the connection to the Backend
  closeChat() {
    if (this.messagesRef) {
      this.messagesRef.off();
    }
  }

  uploadImage(uri, mime = 'application/octet-stream') {
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const sessionId = new Date().getTime();
      let uploadBlob = null;
      const storage = firebase.storage();
      const imageRef = storage.ref('images').child(`${sessionId}`);

      fs
        .readFile(uploadUri, 'base64')
        .then(data => Blob.build(data, { type: `${mime};BASE64` }))
        .then((blob) => {
          uploadBlob = blob;
          return imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  uploadAudio(uri, mime = 'application/octet-stream') {
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const sessionId = new Date().getTime();
      let uploadBlob = null;
      const storage = firebase.storage();
      const imageRef = storage.ref('images').child(`${sessionId}`);

      fs
        .readFile(uploadUri, 'base64')
        .then(data => Blob.build(data, { type: `${mime};BASE64` }))
        .then((blob) => {
          uploadBlob = blob;
          return imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default new Backend();
