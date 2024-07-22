import {I18n} from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import tr from './tr.json';
import en from './en.json';
const locales = RNLocalize.getLocales();

const i18n = new I18n({
  tr: tr,
  en: en,
});

i18n.locale = locales[0].languageCode;
export default i18n;
