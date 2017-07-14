import React from 'react';
import { Modal, View } from 'react-native';

import CameraRollPicker from 'react-native-camera-roll-picker';
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';

export default class PhotoSelect extends React.Component {
  constructor(props) {
    super(props);
    this.selImages = [];
    this.state = {
      modalVisible: false,
    };
    this.selectImages = this.selectImages.bind(this);
  }

  setImages(images) {
    this.selImages = images;
  }

  getImages() {
    return this.selImages;
  }

  setModalVisible(visible = false) {
    this.setState({ modalVisible: visible });
  }

  selectImages(images) {
    this.setImages(images);
  }

  renderNavBar() {
    return (
      <NavBar
        style={{
          statusBar: {
            backgroundColor: '#fff',
          },
          navBar: {
            backgroundColor: '#fff',
          },
        }}
      >
        <NavButton
          onPress={() => {
            this.setModalVisible(false);
          }}
        >
          <NavButtonText
            style={{
              color: '#000',
            }}
          >
            {'Cancel'}
          </NavButtonText>
        </NavButton>
        <NavTitle
          style={{
            color: '#000',
          }}
        >
          {'Select Photo'}
        </NavTitle>
        <NavButton
          onPress={() => {
            this.setModalVisible(false);

            const images = this.getImages().map(image => ({
              image: image.uri,
            }));
            this.props.onSend(images);
            this.setImages([]);
          }}
        >
          <NavButtonText
            style={{
              color: '#000',
            }}
          >
            {'Send'}
          </NavButtonText>
        </NavButton>
      </NavBar>
    );
  }

  render() {
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setModalVisible(false);
        }}
      >
        <View style={{ position: 'absolute', height: 350, bottom: 0, left: 0, right: 0 }}>
          {this.renderNavBar()}
          <CameraRollPicker
            backgroundColor={'transparent'}
            maximum={1}
            imagesPerRow={4}
            callback={this.selectImages}
            selected={[]}
          />
        </View>
      </Modal>
    );
  }
}


PhotoSelect.contextTypes = {
  actionSheet: React.PropTypes.func,
};

PhotoSelect.defaultProps = {
  onSend: () => {},
  options: {},
  icon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
};

PhotoSelect.propTypes = {
  onSend: React.PropTypes.func,
};
