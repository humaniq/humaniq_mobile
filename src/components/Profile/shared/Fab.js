import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import CustomStyleSheet from '../../../utils/customStylesheet'

const HEADER_MAX_HEIGHT = 160;
const TOOLBAR_HEIGHT = 56;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - TOOLBAR_HEIGHT;

class Fab extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { opacity, scroll, source, onClick } = this.props;
    return (
      <Animated.View
        style={[styles.fabContainer, {
          transform: [{ translateY: scroll.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -HEADER_SCROLL_DISTANCE],
            extrapolate: 'clamp',
          }) }, {
            scale: scroll.interpolate({
              inputRange: [0, HEADER_SCROLL_DISTANCE / 3, HEADER_SCROLL_DISTANCE / 2],
              outputRange: [1, 1, 0.4],
              extrapolate: 'clamp',
            }),
          }],
        }, {
          height: opacity.interpolate({
            inputRange: [0, 0],
            outputRange: [0, 66],
          }),
          width: opacity.interpolate({
            inputRange: [0, 0],
            outputRange: [0, 66],
          }),
        }]}
      >
        <TouchableOpacity
          onPress={onClick}
          activeOpacity={0.8}
        >
          <Animated.Image
            source={source}
            style={[styles.fabButton]}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  fabButton: {
    width: 66,
    height: 66,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    marginTop: HEADER_MAX_HEIGHT - 33,
  },
});

export default Fab;

