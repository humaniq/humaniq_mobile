import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Temp = ({ navigation: { navigate } }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <TouchableOpacity style={{ backgroundColor: 'red', margin: 30 }} onPress={() => navigate('Choose')}>
      <Text> TRANSACTION </Text>
    </TouchableOpacity>
  </View>
);
Temp.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};


const mapStateToProps = state => ({
  chats: state.chats,
  messages: state.messages,
  contacts: state.contacts,
});

export default connect(mapStateToProps)(Temp);
