import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';
import i18n from '../lang/_i18n';
import * as RNLocalize from 'react-native-localize';
import {useDispatch, useSelector} from 'react-redux';
import {authActions, userLocaleSelector} from './auth/_store/auth';

const Splash = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const locales = RNLocalize.getLocales();
  const userLocale = useSelector(userLocaleSelector);

  React.useEffect(() => {
    if (!userLocale) {
      dispatch(authActions.setUserLocale(locales[0]));
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
      }}>
      <ActivityIndicator size="large" animating={true} />
      <Text variant="bodyMedium">{i18n.t('loading')}</Text>
    </View>
  );
};

export default Splash;
