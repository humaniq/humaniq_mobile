/* eslint-disable */
import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  TouchableHighlight,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import CustomStyleSheet from '../../../utils/customStylesheet';
import Confirm from '../Buttons/Confirm';
// assets
const illustration = require('../../../assets/icons/illustration.png');
const play = require('../../../assets/icons/ic_play.png');

export default class Tutorial extends Component {
  static propTypes = {
    // nextScene: PropTypes.string.isRequired,
  };
  static navigationOptions = {
    // header: null,
  };

  state = {
    watched: false,
    nextScene: 'Camera',
  };

  componentWillMount() {
    const navState = this.props.navigation.state;
    if (navState.params && navState.params.nextScene) {
      const nextScene = this.props.navigation.state.params.nextScene;
      this.setState({ nextScene });
    }
  }

  handleTutorialPlay = () => {
    this.setState({ watched: true });
  };

  handleNavigate = () => {
    const navState = this.props.navigation.state;
    this.props.navigation.navigate(this.state.nextScene, { ...navState.params });
  };

  handleNavigateInstruction = () => {
    this.props.navigation.navigate('Instructions');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ alignSelf: 'center', fontSize: 30 }}>
          {`tutorial for ${this.state.nextScene}`}
        </Text>

        <TouchableOpacity
          style={styles.player}
          onPress={this.handleTutorialPlay}
        >
          <Image source={illustration} />
          <Image style={styles.iconPlay} source={play} />
        </TouchableOpacity>
        <TouchableHighlight style={styles.btn} onPress={this.handleNavigate}>
          <Text>show next screen</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.btn} onPress={this.handleNavigateInstruction}>
          <Text>show video tutorial</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
  player: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 47,
  },
  iconPlay: {
    marginTop: -15,
  },
  btn: {
    height: 50,
    marginVertical: 10,
    backgroundColor: 'lightgray'
  }
});
