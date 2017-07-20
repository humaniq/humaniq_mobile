import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
} from 'react-native';
import CustomStyleSheet from '../../../utils/customStylesheet';
import ConfirmButton from '../Buttons/ConfirmButton';
import HelpButton from '../Buttons/HelpButton';
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
    const navState = this.props.navigation.state;
    this.props.navigation.navigate(this.state.nextScene, { ...navState.params });
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
      <Image style={styles.illustration} source={source} />
      <View style={styles.buttonsContainer}>
        <HelpButton onPress={this.handleHelpPress} />
        <ConfirmButton onPress={this.handleConfirmPress} />
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
    width: 360,
    height: 77,
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
});
