import React from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {View} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';

export type StackParamList = {
  Main: undefined;
  Transaction: {type: string};
};

type NavigationProps = StackNavigationProp<StackParamList>;
type TransactionPageRouteProp = RouteProp<StackParamList, 'Transaction'>;

const Transaction = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<TransactionPageRouteProp>();
  const transactionType = route?.params.type;
  const theme = useTheme();
  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Text>{transactionType}</Text>
    </View>
  );
};

export default Transaction;
