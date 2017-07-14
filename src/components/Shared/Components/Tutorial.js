import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import CustomStyleSheet from '../../../utils/customStylesheet';
import ConfirmButton from '../Buttons/ConfirmButton';
import HelpButton from '../Buttons/HelpButton';
// assets
// const illustration = require('../../../assets/icons/illustration.png');
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
    return (
      <View style={styles.container}>
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
    justifyContent: 'flex-end',
    backgroundColor: '$cBrand',
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
});
