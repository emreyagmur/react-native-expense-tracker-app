import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';
import i18n from '../lang/_i18n';

const Splash = () => {
  const theme = useTheme();
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
