import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import Sound from 'react-native-sound';

const ovalPlay = require('./../../assets/icons/oval_play.png');

class AudioView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: 0,
      playing: false,
      loading: true,
      error: false,
      position: 0,
    }

    this.sound = new Sound(this.props.currentMessage.audio, null, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        this.setState({
          loading: false,
          duration: 0,
          error: true,
        });
        return;
      }
      console.log('--> sound loaded')
      this.setState({
        loading: false,
        duration: Math.round(this.sound.getDuration() * 1000) / 1000,
      });
    });
    this.play = () => {
      this.setState({
        playing: true,
      });
      const startTime = Date.now();
      let interval = setInterval(() => {
        this.setState({
          position: Math.round((Date.now() - startTime) / 10) / 100,
        });
      }, 300);
      this.sound.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
        clearInterval(interval);
        interval = null;
        this.setState({
          playing: false,
          position: 0
        })
      });
    }
  }
  componentDidMount() {
  }
  render() {
    const getSoundState = () => {
      if (this.state.error) return 'error';
      if (this.state.loading) return 'loading';
      return this.state.playing ? this.state.position : this.state.duration;
    };

    const percent = () => {
      if (this.state.error) return 0;
      if (this.state.loading) return 0;
      if (!this.state.duration) return 0;
      return this.state.position / this.state.duration
    }
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.play}
      >
        <View style={{ margin: 10, marginBottom: 5, flexDirection: 'row' }}>
          <Image source={ovalPlay} />
          <View style={{ height: 4, borderRadius: 2, marginTop: 14, marginLeft: 5, backgroundColor: '#9b9b9b', width: 160 }}>
            <View style={{ height: 4, borderRadius: 2, backgroundColor: 'green', width: 160 * percent() }} />
          </View>
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 10, backgroundColor: 'transparent', color: '#9b9b9b', textAlign: 'left' }}>
            {getSoundState()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class CustomView extends React.Component {
  //
  render() {
    if (this.props.currentMessage.audio) {
      return (
        <AudioView {...this.props} />
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
});

CustomView.defaultProps = {
  currentMessage: {},
  containerStyle: {},
  mapViewStyle: {},
};

CustomView.propTypes = {
  currentMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  mapViewStyle: View.propTypes.style,
};
