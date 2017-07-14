import EStyleSheet from 'react-native-extended-stylesheet';
import * as _ from 'underscore';
import { vh, vw } from './units';

EStyleSheet.build({
  $cBrand: '#3aa3e3',
  $cBrand_dark: '#439fe0',
  $cGray: '#9B9B9B',
  $cGrayLight: '#D8D8D8',
  $cPaper: '#fff',
});

const adjustableProperties = {
  width: [
    'marginLeft',
    'marginRight',
    'marginHorizontal',
    'paddingRight',
    'paddingLeft',
    'paddingHorizontal',
    'left',
    'right',
    'width',
  ],
  height: [
    'marginTop',
    'marginBottom',
    'marginVertical',
    'paddingTop',
    'paddingBottom',
    'paddingVertical',
    'top',
    'bottom',
    'height',
  ],
  exceptions: [
    'borderWidth',
    'borderRadius',
    'shadowRadius',
    'padding',
    'margin',
  ],
};

const CustomStyleSheet = (styleSheet) => {
  _.each(styleSheet, (selector) => {
    _.each(selector, (value, property) => {
      const style = selector;
      const containsHeight = _.includes(adjustableProperties.height, property);
      const containsWidth = _.includes(adjustableProperties.width, property);
      const containsExceptions = _.includes(adjustableProperties.exceptions, property);

      if (containsHeight) {
        style[property] = vh(value);
      } else if (containsWidth || containsExceptions) {
        style[property] = vw(value);
      } else if (property === 'fontSize') {
        // adjust font, check with scale
        style[property] = value;
      } else if (property === 'round') {
        style.width = vh(value);
        style.height = vh(value);
        delete style[property];
      }
    });
  });
  return EStyleSheet.create(styleSheet);
};

export default CustomStyleSheet;
