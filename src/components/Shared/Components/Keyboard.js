import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Animated
} from 'react-native';
import PropTypes from 'prop-types';
import Animation from 'lottie-react-native';
import CustomStyleSheet from '../../../utils/customStylesheet';

const icHelp = require('../../../assets/icons/chat_white.png');
const backSpaceWhite = require('../../../assets/icons/back_space_white.png');
const btnRoundRipple = require('../../../assets/animations/btn-round-ripple.json');

class Key extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: new Animated.Value(0),
    };
  }

  animate = (time, fr = 0, to = 1, callback) => {
    this.state.progress.setValue(fr);
    Animated.timing(this.state.progress, {
      toValue: to,
      duration: time,
    }).start(callback);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const rightCellValues = [3, 6, 9];
    const leftCellValues = [1, 4, 7];
    let style = {};
    if (rightCellValues.includes(this.props.number)) {
      style = styles.right;
    } else if (leftCellValues.includes(this.props.number)) {
      style = styles.left;
    }
    return (
      <TouchableWithoutFeedback
        style={styles.cell}
        accessibilityLabel={this.props.number.toString() }
        onPress={() => { this.props.onPress(this.props.number); } }
        onPressOut={() => { this.animate(500, 0, 1); } }
        >
        <View style={styles.cellContainer}>
          <View style={styles.animationContainer}>
            <Animation
              style={styles.animation}
              source={btnRoundRipple}
              progress={this.state.progress}
              />
          </View>
          <Text
            style={styles.number}>{this.props.number}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default class VirtualKeyboard extends Component {
  static propTypes = {
    isBackspaceEnabled: PropTypes.bool,
    onNumberPress: PropTypes.func.isRequired,
    onBackspacePress: PropTypes.func.isRequired,
    onHelpPress: PropTypes.func,
  };

  renderRow = (numbersArray) => {
    const cells = numbersArray.map((val, idx, arr) => this.renderCell(val, idx, arr));
    return (
      <View style={styles.row}>
        {cells}
      </View>
    );
  };

  renderCell = (number) => {
    return (
      <Key key={number} number={number} onPress={(e) => this.props.onNumberPress(e) }/>
    );
  };

  renderBackspace = () => (
    this.props.isBackspaceEnabled ? <TouchableOpacity
      style={styles.backspace}
      onPress={this.props.onBackspacePress}
      >
      {this.props.isBackspaceEnabled && <Image source={backSpaceWhite} />}
    </TouchableOpacity> : <View style={styles.backspace}/> 
  );

  renderHelp = () => (
  this.props.onHelpPress ?
    <TouchableOpacity
      style={styles.help}
      onPress={this.props.onHelpPress}
    >
      <Image source={icHelp} />
    </TouchableOpacity>
    :
    <View style={styles.help} />
  );

  render() {
    return (
      <View style={styles.container}>
        {this.renderRow([1, 2, 3]) }
        {this.renderRow([4, 5, 6]) }
        {this.renderRow([7, 8, 9]) }
        <View style={[styles.row, styles.bottomrow]}>
          {this.renderHelp() }
          {this.renderCell(0) }
          {this.renderBackspace() }
        </View>
      </View>
    );
  } // render
} // return

const styles = CustomStyleSheet({
  container: {
    alignSelf: 'center',
    height: 224,
    width: 270,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomrow: {
    paddingRight: 20,
    paddingLeft: 20,
  },
  number: {
    fontSize: 30,
    textAlign: 'center',
    color: '$cPaper',
  },
  backspace: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 37.5,
    height: 56,
  },
  help: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 23.5,
    marginRight: 14,
  },
  cell: {
    width: 64,
    alignItems: 'center',
  },
  cellContainer: {
    width: 64,
    justifyContent: 'center'
  },
  animationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 60,
    height: 60,
  },
  right: {
    alignSelf: 'flex-end'
  },
  left: {
    alignSelf: 'flex-start'
  }
});
