import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, ScrollView, TextInput, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

class Temp extends React.Component {

  render(){
    const { navigation } = this.props;
    const { dispatch, navigate, state } = navigation;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity style={{ backgroundColor: 'red', margin: 30 }} onPress={() => navigate('Choose')}>
          <Text> TRANSACTION </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  chats: state.chats,
  messages: state.messages,
  contacts: state.contacts,
});

export default connect(mapStateToProps)(Temp);
