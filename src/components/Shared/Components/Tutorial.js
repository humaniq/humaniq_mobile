import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  StatusBar,
} from 'react-native';
import CustomStyleSheet from '../../../utils/customStylesheet';
import ConfirmButton from '../Buttons/ConfirmButton';
import HelpButton from '../Buttons/HelpButton';
import MixPanel from 'react-native-mixpanel';

// assets
const cameraIllustration = require('../../../assets/icons/camera_illustration.png');
const passwordIllustration = require('../../../assets/icons/password_illustration.png');
const telephoneIllustration = require('../../../assets/icons/telephone_illustration.png');
// const play = require('../../../assets/icons/ic_play.png');

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

  handleConfirmPress = () => {
    MixPanel.trackWithProperties('Click Registration Button', {nextScene: this.state.nextScene});
    const navState = this.props.navigation.state;
    this.props.navigation.navigate(this.state.nextScene, { ...navState.params });
    MixPanel.track(`Open${this.state.nextScene} Screen`);
  };

handleHelpPress = () => {
  this.props.navigation.navigate('Instructions');
};

render() {
  let source = "";
  switch (this.state.nextScene) {
    case "Camera":
      source = cameraIllustration;
      break;
    case "Password":
      source = passwordIllustration;
      break;
    case "TelInput":
      source = telephoneIllustration;
      break;
    default:
      break;
  }

  return (
    <View style={styles.container}>
      <StatusBar
          backgroundColor='#3aa3e3'
      />
      <Image style={styles.illustration} source={source} />
      <View style={styles.buttonsContainer}>
        {/*<HelpButton onPress={this.handleHelpPress} />*/}
        <ConfirmButton onPress={this.handleConfirmPress} containerStyle={{ flex: 1 }}/>
      </View>
    </View>
  );
}
}

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: '$cBrand',
  },
  illustration: {
    width: "100%",
    height: "100%"
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    width: "100%",
    height: 77,
    flexDirection: 'row',
    padding: 16,
  },
});
