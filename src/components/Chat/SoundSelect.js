import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
  Modal,
} from 'react-native';

import Sound from 'react-native-sound';
import {
  AudioRecorder,
  AudioUtils,
} from 'react-native-audio';

class SoundSelect extends Component {

  state = {
    currentTime: 0.0,
    recording: false,
    stoppedRecording: false,
    finished: false,
    audioPath: `${AudioUtils.DocumentDirectoryPath}/test.aac`,
    hasPermission: undefined,
    visible: false,
  };

  componentDidMount() {
    this.checkPermission().then((hasPermission) => {
      this.setState({
        hasPermission,
      });

      if (!hasPermission) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = (data) => {
        this.setState({
          currentTime: Math.floor(data.currentTime),
        });
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this.finishRecording(data.status === 'OK', data.audioFileURL);
        }
      };
    });
  }

  setModalVisible(visible = false) {
    this.setState({
      visible,
    });
  }

  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000,
    });
  }

  checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    const rationale = {
      'title': 'Microphone Permission',
      'message': 'SoundSelect needs access to your microphone so you can record audio.'
    };

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      .then((result) => {
        console.log('Permission result:', result);
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
      });
  }

  renderButton(title, onPress, active) {
    const style = (active) ? styles.activeButtonText : styles.buttonText;

    return (
      <TouchableHighlight
        style={styles.button}
        onPress={onPress}
      >
        <Text style={style}> { title } </Text>
      </TouchableHighlight>
    );
  }

  async pause() {
    if (!this.state.recording) {
      console.warn('Can\'t pause, not recording!');
      return;
    }

    this.setState({
      stoppedRecording: true,
      recording: false
    });

    try {
      const filePath = await AudioRecorder.pauseRecording();

      // Pause is currently equivalent to stop on Android.
      if (Platform.OS === 'android') {
        this.finishRecording(true, filePath);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async stop() {
    if (!this.state.recording) {
      console.warn('Can\'t stop, not recording!');
      return;
    }

    this.setState({
      stoppedRecording: true,
      recording: false
    });

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === 'android') {
        this.finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  async play() {
    if (this.state.recording) {
      await this.stop();
    }

    // These timeouts are a hacky workaround for some issues with react-native-sound.
    // See https://github.com/zmxv/react-native-sound/issues/89.
    setTimeout(() => {
      var sound = new Sound(this.state.audioPath, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
        }
      });

      setTimeout(() => {
        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }, 100);
    }, 100);
  }

  async record() {
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    if (!this.state.hasPermission) {
      console.warn('Can\'t record, no permission granted!');
      return;
    }

    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({
      recording: true
    });

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  finishRecording(didSucceed, filePath) {
    this.setState({
      finished: didSucceed
    });
    console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
  }

  render() {
    const { onSend } = this.props;
    const send = () => {
      const audio = {
        audio: this.state.audioPath,
      };

      onSend([audio]);
    };
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={this.state.visible}
        onRequestClose={() => {
          this.setModalVisible(false);
        }}
      >
        <View style={styles.container} >
          <View style={styles.soundBar}>
            { this.renderButton('O', () => { this.record(); }, this.state.recording)}
            { this.renderButton('>', () => { this.play(); }) }
            { this.renderButton('[]', () => { this.stop(); }) }
            { this.renderButton('||', () => { this.pause(); })}
            { this.renderButton('@', () => { this.stop(); send(); this.setModalVisible(false); })}
            <Text style={styles.progressText}>
              { this.state.currentTime}
            </Text>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  soundBar: {
    height: 110,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 2,
    borderColor: '#9b9b9b',
    borderBottomWidth: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: '#fff',
  },
  button: {
    padding: 20,
  },
  disabledButtonText: {
    color: '#eee',
  },
  buttonText: {
    fontSize: 20,
    color: 'red',
  },
  activeButtonText: {
    fontSize: 20,
    color: '#B81F00',
  }

});

export default SoundSelect;
