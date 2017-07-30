import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Image,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import Animation from 'lottie-react-native';
import CustomStyleSheet from '../../../utils/customStylesheet';

const ic_help = require('../../../assets/icons/ic_help.png');
const btnRipple = require('../../../assets/animations/btn-ripple.json');

export default class HelpButton extends Component {

  static propTypes = {
    onPress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      progress: new Animated.Value(0),
    };
  }

  animate = (time, fr = 0, to = 1, callback) => {
    this.state.progress.setValue(fr);
    const animationref = Animated.timing(this.state.progress, {
      toValue: to,
      duration: time,
    }).start(callback);
  }

  render() {
    return (
      // using TouchH instead TouchO to disable pressing when prop active == false
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={this.props.onPress}
        onPressIn={() => this.animate(500, 0, 1) }>
        <View style={styles.container}>
          <Image source={ic_help} style={styles.icon}/>
          <Animation
            style={styles.animationStyle}
            source={btnRipple}
            progress={this.state.progress}
            />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = CustomStyleSheet({
  container: {
    width: 155,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '$cPaper',
    borderRadius: 3,
  },
  icon: {
    position: "absolute",
    alignSelf: 'center'
  },
  animationStyle: {
    width: 155,
    height: 45,
  },
});
