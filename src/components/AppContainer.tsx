import * as React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {useSelector} from 'react-redux';
type Props = {
  children: React.ReactNode;
};

const AppContainer = (props: Props) => {
  return <NavigationContainer>{props.children}</NavigationContainer>;
};

export default AppContainer;
