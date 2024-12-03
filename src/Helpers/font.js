import {Platform, I18nManager} from 'react-native';

// const ArabicFont = Platform.OS === 'ios' ? 'GE-SS-Two-Light' : 'GE-SS-Two-Bold';
const ArabicFont = Platform.OS === 'ios' ? 'Arial' : 'Arial';
const EnglishFont = 'Arial';
const Font = I18nManager.isRTL ? ArabicFont : EnglishFont;

export {ArabicFont, EnglishFont};

export default Font;
