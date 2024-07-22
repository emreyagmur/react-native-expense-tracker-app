import {Minus, Plus} from 'lucide-react-native';
import React from 'react';
import {View} from 'react-native';
import {Avatar, Button, Card, Text, useTheme} from 'react-native-paper';
import i18n from '../../lang/_i18n';

const Home = () => {
  const theme = useTheme();
  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: theme.colors.background,
        }}>
        <Avatar.Text size={32} label="EY" style={{marginRight: 10}} />
        <Text variant="bodyMedium">{i18n.t('hello')}, Emre</Text>
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
          onPress={() => console.log('Pressed')}>
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
          onPress={() => console.log('Pressed')}>
          {i18n.t('login')}
        </Button>
      </View>
    </View>
  );
};

export default Home;
