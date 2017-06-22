import { Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const DESIGN_WIDTH = 320;
const DESIGN_HEIGHT = 568;

function fontScale(sWidth, dWidth) {
  return sWidth / dWidth;
}

const pixelRatio = fontScale(SCREEN_WIDTH, DESIGN_WIDTH);

function viewPortCalc(px, design, screen) {
  if (typeof px === 'string' && /^[\d.]+%$/.test(px)) {
    px = parseInt(px, 10) * design / 100;
  }
  return Math.ceil(px * screen / design);
}

function vw(px) {
  return viewPortCalc(px, DESIGN_WIDTH, SCREEN_WIDTH);
}

function vh(px) {
  return viewPortCalc(px, DESIGN_HEIGHT, SCREEN_HEIGHT);
}


export { SCREEN_HEIGHT, SCREEN_WIDTH, pixelRatio, vw, vh };