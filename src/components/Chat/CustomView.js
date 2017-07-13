/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import AudioView from './AudioView';


export default class CustomView extends React.Component {
  //
  render() {
    if (this.props.currentMessage.audio) {
      return <AudioView {...this.props} />;
    }
    return null;
  }
}

CustomView.defaultProps = {
  currentMessage: {},
};

CustomView.propTypes = {
  currentMessage: React.PropTypes.object,
};
