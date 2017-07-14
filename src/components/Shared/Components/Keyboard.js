import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Image,
} from 'react-native';
import PropTypes from 'prop-types';
import CustomStyleSheet from '../../../utils/customStylesheet';

const ic_help = require('../../../assets/icons/ic_help.png');

export default class VirtualKeyboard extends Component {
  static propTypes = {
    color: PropTypes.string,
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
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor={'#FFFFFF30'}
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
      </TouchableHighlight >
    );
  };

  renderBackspace = () => (
    <TouchableOpacity
      style={styles.backspace}
      onPress={this.props.onBackspacePress}
    >
      <Text>back</Text>
    </TouchableOpacity>
        );

  renderHelp = () => (
    <TouchableOpacity
      style={styles.help}
      onPress={this.props.onHelpPress}
    >
      <Image source={ic_help} />
    </TouchableOpacity>
        );

  render() {
    return (
      <View style={styles.container}>
        {this.renderRow([1, 2, 3])}
        {this.renderRow([4, 5, 6])}
        {this.renderRow([7, 8, 9])}
        {this.renderRow([7, 8, 9])}
        <View style={styles.row}>
          {this.renderHelp()}
          {this.renderCell(0)}
          {this.renderBackspace()}
        </View>
      </View>
    );
  } // render
} // return

const styles = CustomStyleSheet({
  container: {
    alignSelf: 'center',
    height: 224,
    width: 216,
    backgroundColor: 'transparent'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  number: {
    fontSize: 25,
    textAlign: 'center',
    color: '$cPaper'
  },
  backspace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  help: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    height: 40,
    width: 40,
    borderRadius: 18,
    justifyContent: 'center',
  },
  middleCell: {
  },
});
