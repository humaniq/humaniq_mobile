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

const ic_help = require('../../../assets/icons/chat_white.png');
const back_space_white = require('../../../assets/icons/back_space_white.png');

export default class VirtualKeyboard extends Component {
  static propTypes = {
    color: PropTypes.string,
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
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor={'#FFFFFF30'}
        style={[
          styles.cell,
          middleCellValues.includes(number) && styles.middleCell,
        ]}
        key={number}
        accessibilityLabel={number.toString() }
        onPress={() => {
          this.props.onNumberPress(number.toString());
        } }
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
      {this.props.isBackspaceEnabled && <Image source={back_space_white} />}
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
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  number: {
    fontSize: 30,
    textAlign: 'center',
    color: '$cPaper'
  },
  backspace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  help: {
    flex: 1,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 100,
    justifyContent: 'center',
  },
  middleCell: {
  },
});
