/* eslint-disable react/forbid-prop-types */

import React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';

export default class Composer extends React.Component {
  onChange(e) {
    const contentSize = e.nativeEvent.contentSize;
    if (!this.contentSize) {
      this.contentSize = contentSize;
      this.props.onInputSizeChanged(this.contentSize);
    } else if (
      this.contentSize.width !== contentSize.width ||
      this.contentSize.height !== contentSize.height
    ) {
      this.contentSize = contentSize;
      this.props.onInputSizeChanged(this.contentSize);
    }
  }

  onChangeText(text) {
    this.props.onTextChanged(text);
  }

  render() {
    return (
      <TextInput
        placeholder={this.props.placeholder}
        placeholderTextColor={this.props.placeholderTextColor}
        multiline={this.props.multiline}
        onChange={e => this.onChange(e)}
        onChangeText={text => this.onChangeText(text)}
        style={[styles.textInput, this.props.textInputStyle]}
        value={this.props.text}
        accessibilityLabel={this.props.text || this.props.placeholder}
        enablesReturnKeyAutomatically
        underlineColorAndroid="transparent"
        {...this.props.textInputProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    lineHeight: 16,
    marginBottom: 3,
  },
});

Composer.defaultProps = {
  onChange: () => {},
  composerHeight: Platform.select({
    ios: 33,
    android: 41,
  }), // TODO SHARE with GiftedChat.js and tests
  text: '',
  // placeholder: 'Type a message...',
  placeholderTextColor: '#b2b2b2',
  textInputProps: null,
  multiline: true,
  textInputStyle: {},
  onTextChanged: () => {},
  onInputSizeChanged: () => {},
};

Composer.propTypes = {
  text: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  placeholderTextColor: React.PropTypes.string,
  textInputProps: React.PropTypes.object,
  onTextChanged: React.PropTypes.func,
  onInputSizeChanged: React.PropTypes.func,
  multiline: React.PropTypes.bool,
  textInputStyle: TextInput.propTypes.style,
};
