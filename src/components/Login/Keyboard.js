import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import CustomStyleSheet from '../../utils/customStylesheet';

const ic_help = require('../../assets/icons/ic_help.png');

export default class VirtualKeyboard extends Component {
  /*
   static propTypes = {
   onNumberPress: PropTypes.func.isRequired,
   onBackspacePress: PropTypes.func.isRequired,
   onHelpPress: PropTypes.func.isRequired,
   };
   */

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
          middleCellValues.includes(number) && styles.middleCell
        ]}
                key={number}
                accessibilityLabel={number.toString()}
                onPress={() => {
          this.props.onNumberPress(number.toString());
        }}
            >
              <Text style={[styles.number, { color: this.props.color }]}>{number}</Text>
            </TouchableOpacity>
        );
    };

    renderBackspace = () => {
        return (
            <TouchableOpacity
                style={styles.backspace}
                onPress={this.props.onBackspacePress}
            >
              <Text>back</Text>
            </TouchableOpacity>
        );
    };

    renderHelp = () => {
        return (
            <TouchableOpacity
                style={styles.help}
                onPress={this.props.onHelpPress}
            >
              <Image source={ic_help} />
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                {this.renderRow([1, 2, 3])}
                {this.renderRow([4, 5, 6])}
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
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#CACCCC',
        backgroundColor: '#D8D8D8',
    },
    number: {
        fontSize: 25,
        textAlign: 'center',
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
        height: 30,
        width: 60,
        flex: 1,
        justifyContent: 'center',
    },
    middleCell: {
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#CACCCC',
        borderRightColor: '#CACCCC',
    },
});
