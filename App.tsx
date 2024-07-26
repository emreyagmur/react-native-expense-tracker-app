import React from 'react';
import Main from './src';
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from 'react-native-paper';
import AppContainer from './src/components/AppContainer';
import {useColorScheme} from 'react-native';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {Provider} from 'react-redux';
import store, {persistor} from './src/store/store';
import {PersistGate} from 'redux-persist/integration/react';

axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return error.response;
  },
);

const App = () => {
  const DarkColor = {
    primary: 'rgb(10, 132, 255)',
    onPrimary: 'rgb(0, 40, 95)',
    primaryContainer: 'rgb(0, 71, 134)',
    onPrimaryContainer: 'rgb(212, 227, 255)',
    secondary: 'rgb(188, 199, 220)',
    onSecondary: 'rgb(39, 49, 65)',
    secondaryContainer: 'rgb(61, 71, 88)',
    onSecondaryContainer: 'rgb(216, 227, 248)',
    tertiary: 'rgb(218, 189, 226)',
    onTertiary: 'rgb(61, 40, 70)',
    tertiaryContainer: 'rgb(85, 63, 93)',
    onTertiaryContainer: 'rgb(247, 216, 255)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(26, 28, 30)',
    onBackground: 'rgb(227, 226, 230)',
    surface: 'rgb(26, 28, 30)',
    onSurface: 'rgb(227, 226, 230)',
    surfaceVariant: 'rgb(67, 71, 78)',
    onSurfaceVariant: 'rgb(195, 198, 207)',
    outline: 'rgb(67, 71, 78)',
    outlineVariant: 'rgb(67, 71, 78)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(227, 226, 230)',
    inverseOnSurface: 'rgb(47, 48, 51)',
    inversePrimary: 'rgb(0, 95, 175)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(33, 37, 41)',
      level2: 'rgb(37, 42, 48)',
      level3: 'rgb(41, 47, 55)',
      level4: 'rgb(43, 49, 57)',
      level5: 'rgb(46, 52, 62)',
    },
    surfaceDisabled: 'rgba(227, 226, 230, 0.12)',
    onSurfaceDisabled: 'rgba(227, 226, 230, 0.38)',
    backdrop: 'rgba(45, 49, 56, 0.4)',
  };

  const LightColor = {
    primary: 'rgb(10, 132, 255)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(212, 227, 255)',
    onPrimaryContainer: 'rgb(0, 28, 58)',
    secondary: 'rgb(84, 95, 113)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(216, 227, 248)',
    onSecondaryContainer: 'rgb(17, 28, 43)',
    tertiary: 'rgb(110, 86, 118)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(247, 216, 255)',
    onTertiaryContainer: 'rgb(39, 20, 48)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(253, 252, 255)',
    onBackground: 'rgb(26, 28, 30)',
    surface: 'rgb(253, 252, 255)',
    onSurface: 'rgb(26, 28, 30)',
    surfaceVariant: 'rgb(224, 226, 236)',
    onSurfaceVariant: 'rgb(67, 71, 78)',
    outline: 'rgb(224, 226, 236)',
    outlineVariant: 'rgb(195, 198, 207)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(47, 48, 51)',
    inverseOnSurface: 'rgb(241, 240, 244)',
    inversePrimary: 'rgb(165, 200, 255)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(240, 244, 251)',
      level2: 'rgb(233, 239, 249)',
      level3: 'rgb(225, 235, 246)',
      level4: 'rgb(223, 233, 245)',
      level5: 'rgb(218, 230, 244)',
    },
    surfaceDisabled: 'rgba(26, 28, 30, 0.12)',
    onSurfaceDisabled: 'rgba(26, 28, 30, 0.38)',
    backdrop: 'rgba(45, 49, 56, 0.4)',
  };

  const LightSchema = {
    ...MD3LightTheme,
    colors: LightColor,
  };

  const DarkSchema = {
    ...MD3DarkTheme,
    colors: DarkColor,
  };

  const colorScheme = useColorScheme();
  const paperTheme = colorScheme !== 'dark' ? DarkSchema : LightSchema;
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={paperTheme}>
          <AppContainer>
            <Main />
          </AppContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
