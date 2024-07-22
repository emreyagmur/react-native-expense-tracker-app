import {Minus, Plus} from 'lucide-react-native';
import React from 'react';
import {View} from 'react-native';
import {Avatar, Button, Card, Text, useTheme} from 'react-native-paper';
import i18n from '../../lang/_i18n';
import {useSelector} from 'react-redux';
import {authUserSelector} from '../auth/_store/auth';
import UserAvatar from '../../components/UserAvatar';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export type StackParamList = {
  TransactionInfo: {itemId: number};
  Transaction: {type: string};
};

type NavigationProps = StackNavigationProp<StackParamList>;

const Home = () => {
  const theme = useTheme();
  const user = useSelector(authUserSelector);
  const navigation = useNavigation<NavigationProps>();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: theme.colors.background,
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: theme.colors.background,
        }}>
        <View style={{marginRight: 5}}>
          <UserAvatar user={user} size={40} />
        </View>
        <Text variant="bodyMedium">
          {i18n.t('hello')}, {user?.name}
        </Text>
      </View>
      <View style={{padding: 10, backgroundColor: theme.colors.background}}>
        <Card>
          <Card.Content>
            <View
              style={{
                alignItems: 'center',
                padding: 10,
              }}>
              <Text variant="titleSmall">Total Balance</Text>
              <Text variant="titleLarge">$500.245.123,12</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
              }}>
              <View style={{alignItems: 'center'}}>
                <Text variant="bodySmall">Total Income</Text>
                <Text variant="bodyMedium">$500.245.123,12</Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <Text variant="bodySmall">Total Expense</Text>
                <Text variant="bodyMedium">$500.245.123,12</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
      <View
        style={{
          padding: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.background,
        }}>
        <Button
          theme={{roundness: 2}}
          style={{
            justifyContent: 'center',
          }}
          icon={() => <Plus size={18} color={theme.colors.onPrimary} />}
          mode="contained"
          onPress={() => navigation.navigate('Transaction', {type: 'income'})}>
          {i18n.t('login')}
        </Button>
        <Button
          buttonColor={theme.colors.error}
          theme={{roundness: 2}}
          style={{
            justifyContent: 'center',
          }}
          icon={() => <Minus size={18} color={theme.colors.onError} />}
          mode="contained"
          onPress={() => navigation.navigate('Transaction', {type: 'expense'})}>
          {i18n.t('login')}
        </Button>
      </View>
    </View>
  );
};

export default Home;
