import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import CustomStyleSheet from '../../../utils/customStylesheet';

const icHelp = require('../../../assets/icons/chat_white.png');
const backSpaceWhite = require('../../../assets/icons/back_space_white.png');

export default class VirtualKeyboard extends Component {
  static propTypes = {
    isBackspaceEnabled: PropTypes.bool,
    onNumberPress: PropTypes.func.isRequired,
    onBackspacePress: PropTypes.func.isRequired,
    onHelpPress: PropTypes.func.isRequired,
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
    const middleCellValues = [2, 5, 8, 0];
    return (
      <TouchableOpacity
        style={[
          styles.cell,
          middleCellValues.includes(number) && styles.middleCell,
        ]}
        key={number}
        accessibilityLabel={number.toString()}
        onPress={() => {
          this.props.onNumberPress(number.toString());
        }}
      >
        <Text style={[styles.number]}>{number}</Text>
      </TouchableOpacity>
    );
  };

  renderBackspace = () => (
    <TouchableOpacity
      style={styles.backspace}
      onPress={this.props.onBackspacePress}
    >
      {this.props.isBackspaceEnabled && <Image source={backSpaceWhite} />}
    </TouchableOpacity>
  );

  renderHelp = () => (
    <TouchableOpacity
      style={styles.help}
      onPress={this.props.onHelpPress}
    >
      <Image source={icHelp} />
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={styles.container}>
        {this.renderRow([1, 2, 3]) }
        {this.renderRow([4, 5, 6]) }
        {this.renderRow([7, 8, 9]) }
        <View style={styles.row}>
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
    width: 230,
    marginBottom: 113,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  help: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 23.5,
    marginRight: 14,
  },
  cell: {
    width: 23.5,
    borderRadius: 100,
    justifyContent: 'center',
  },
  middleCell: {
  },
});
