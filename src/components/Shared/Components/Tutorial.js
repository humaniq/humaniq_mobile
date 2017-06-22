import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
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
      const nextScene  = this.props.navigation.state.params.nextScene;
      this.setState({ nextScene });
    }
  }

  handleTutorialPlay = () => {
    this.setState({ watched: true });
  };

  handleNavigate = () => {
    this.props.navigation.navigate(this.state.nextScene);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{alignSelf: 'center', fontSize: 30}}>
          {`tutorial for ${this.state.nextScene}`}
        </Text>

        <TouchableOpacity
          style={styles.player}
          onPress={this.handleTutorialPlay}
        >
          <Image source={illustration} />
          <Image style={styles.iconPlay} source={play} />
        </TouchableOpacity>
        <Confirm
          active={this.state.watched}
          onPress={this.handleNavigate}
        />
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
});
