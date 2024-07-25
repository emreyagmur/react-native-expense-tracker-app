import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
import Home from './screens/home/Home';
import {BottomNavigation, IconButton, useTheme} from 'react-native-paper';
import Account from './screens/account/Account';
import {ChevronLeft, House, User} from 'lucide-react-native';
import {CommonActions} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {authAccessTokenSelector} from './screens/auth/_store/auth';
import axios from 'axios';
import Splash from './screens/Splash';
import Transaction from './screens/transaction/Transaction';
import i18n from './lang/_i18n';
import TransactionInfo from './screens/transaction/TransactionInfo';
import {currencyActions} from './store/currency';
import Currency from './screens/account/Currency';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTab = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          style={{
            height: 90,
            backgroundColor: theme.colors.surface,
            borderTopWidth: 0.4,
            borderColor: theme.colors.surfaceVariant,
          }}
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({route, preventDefault}) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({route, focused, color}) => {
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size: 24});
            }

            return null;
          }}
          getLabelText={({route}: any) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            return label;
          }}
        />
      )}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => {
            return <House size={size} color={color} />;
          },
          tabBarStyle: {
            paddingBottom: 25,
            paddingTop: 5,
            height: 50,
          },
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({color, size}) => {
            return <User size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const Main = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  const accessToken = useSelector(authAccessTokenSelector);

  React.useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      dispatch(currencyActions.pullCurrencies());
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }

    setLoading(false);
  }, [accessToken]);

  return (
    <>
      <Stack.Navigator>
        {loading ? (
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
        ) : isLogin ? (
          <>
            <Stack.Screen
              name="Main"
              component={BottomTab}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Transaction"
              component={Transaction}
              options={({navigation}) => ({
                headerTitle: i18n.t('new_transaction'),
                headerTitleStyle: {
                  color: theme.colors.onSurfaceVariant,
                },
                headerLeft: () => (
                  <IconButton
                    onPress={() => navigation.goBack()}
                    icon={() => <ChevronLeft color="#0A84FF" size={25} />}
                  />
                ),
                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="TransactionInfo"
              component={TransactionInfo}
              options={({navigation}) => ({
                headerTitle: i18n.t('new_transaction'),
                headerTitleStyle: {
                  color: theme.colors.onSurfaceVariant,
                },
                headerLeft: () => (
                  <IconButton
                    onPress={() => navigation.goBack()}
                    icon={() => <ChevronLeft color="#0A84FF" size={25} />}
                  />
                ),
                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="Currency"
              component={Currency}
              options={({navigation}) => ({
                headerTitle: i18n.t('currency'),
                headerTitleStyle: {
                  color: theme.colors.onSurfaceVariant,
                },
                headerLeft: () => (
                  <IconButton
                    onPress={() => navigation.goBack()}
                    icon={() => <ChevronLeft color="#0A84FF" size={25} />}
                  />
                ),
                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
                headerShadowVisible: false,
              })}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default Main;
