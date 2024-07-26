import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react-native';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  useTheme,
} from 'react-native-paper';
import i18n from '../../lang/_i18n';
import {ConnectedProps, connect, useDispatch} from 'react-redux';
import {
  authActions,
  authCurrencySelector,
  authUserSelector,
  userLocaleSelector,
} from '../auth/_store/auth';
import UserAvatar from '../../components/UserAvatar';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootState} from '../../store/store';
import {
  ITransaction,
  userTransactionsActions,
  userTransactionsPhaseSelector,
  userTransactionsSelector,
} from '../transaction/_store/transaction';
import {FlashList} from '@shopify/flash-list';
import moment from 'moment';
import 'moment/min/locales';
import {NumericFormat} from 'react-number-format';
import {currenciesSelector} from '../../store/currency';
import * as RNLocalize from 'react-native-localize';

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state),
  userLocale: userLocaleSelector(state),
  userTransactions: userTransactionsSelector(state),
  currency: authCurrencySelector(state),
  currencies: currenciesSelector(state),
  phase: userTransactionsPhaseSelector(state),
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type THomeProps = PropsFromRedux;

export type StackParamList = {
  TransactionInfo: {item: Partial<ITransaction>};
  Transaction: {type: string};
};

type NavigationProps = StackNavigationProp<StackParamList>;

const Home = (props: THomeProps) => {
  const {user, currencies, userTransactions, userLocale, currency, phase} =
    props;
  const dispatch = useDispatch();

  const theme = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const insets = useSafeAreaInsets();

  moment.locale(userLocale ? userLocale?.languageCode : 'en');

  const listCount = userTransactions?.length > 0 ? userTransactions.length : 1;

  const [totalIncomes, setTotalIncomes] = React.useState<number>(0);
  const [totalExpenses, setTotalExpenses] = React.useState<number>(0);
  const [totalBalance, setTotalBalance] = React.useState<number>(0);

  React.useEffect(() => {
    const deviceCurrencies = RNLocalize.getCurrencies();
    const c = currencies.find(c => c.code === deviceCurrencies[0]);

    if (c && !currency) {
      dispatch(authActions.setCurrencyStore(c));
    }
  }, []);

  React.useEffect(() => {
    const tIncomes = () => {
      return userTransactions?.filter(
        (incomes: Partial<ITransaction>) => incomes.type === 'income',
      );
    };

    const tExpenses = () => {
      return userTransactions?.filter(
        (incomes: Partial<ITransaction>) => incomes.type === 'expense',
      );
    };

    setTotalIncomes(
      tIncomes().reduce((a, v) => (a = a + parseInt(v.amount)), 0),
    );
    setTotalExpenses(
      tExpenses().reduce((a, v) => (a = a + parseInt(v.amount)), 0),
    );

    setTotalBalance(totalIncomes - totalExpenses);
  }, [userTransactions, totalIncomes, totalExpenses]);

  React.useEffect(() => {
    dispatch(userTransactionsActions.pullUserTransactions(user));
  }, [currency]);

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
        <Card mode="outlined">
          <Card.Content>
            <View
              style={{
                alignItems: 'center',
                padding: 10,
              }}>
              <Text variant="titleSmall">Total Balance</Text>
              <NumericFormat
                value={totalBalance}
                displayType={'text'}
                thousandSeparator={true}
                prefix={currency?.symbol}
                renderText={formattedValue => (
                  <Text variant="titleLarge">{formattedValue}</Text>
                )}
              />
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
                <NumericFormat
                  value={totalIncomes}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={currency?.symbol}
                  renderText={formattedValue => (
                    <Text variant="bodyMedium">{formattedValue}</Text>
                  )}
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text variant="bodySmall">Total Expense</Text>
                <NumericFormat
                  value={totalExpenses}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={currency?.symbol}
                  renderText={formattedValue => (
                    <Text variant="bodyMedium">{formattedValue}</Text>
                  )}
                />
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
          {i18n.t('add_income')}
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
          {i18n.t('add_expense')}
        </Button>
      </View>

      <View style={{flex: 1, padding: 10}}>
        {phase === 'loading' ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator
              color={theme.colors.onPrimary}
              size={28}
              animating={true}
            />
          </View>
        ) : (
          <FlashList
            data={userTransactions}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{marginBottom: 10}}
                onPress={() =>
                  navigation.navigate('TransactionInfo', {item: item})
                }>
                <View
                  style={{
                    backgroundColor: theme.colors.background,
                  }}>
                  <Card>
                    <Card.Content
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        {item.type === 'income' ? (
                          <ArrowDown
                            size={18}
                            style={{marginRight: 10}}
                            color={theme.colors.onSurfaceVariant}
                          />
                        ) : (
                          <ArrowUp
                            size={18}
                            style={{marginRight: 10}}
                            color={theme.colors.onSurfaceVariant}
                          />
                        )}

                        <View
                          style={{
                            gap: 5,
                            maxWidth: '100%',
                            flex: 1,
                          }}>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flex: 1,
                            }}>
                            <NumericFormat
                              value={item?.amount}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={currency?.symbol}
                              renderText={formattedValue => (
                                <Text variant="bodyMedium">
                                  {formattedValue}
                                </Text>
                              )}
                            />
                            <Text variant="bodySmall">
                              {moment(item?.transaction_date).fromNow()}
                            </Text>
                          </View>

                          <Text numberOfLines={1} variant="bodySmall">
                            {item?.title}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          padding: 5,
                        }}>
                        <ChevronRight
                          size={18}
                          color={theme.colors.onSurfaceVariant}
                        />
                      </View>
                    </Card.Content>
                  </Card>
                </View>
              </TouchableOpacity>
            )}
            estimatedItemSize={listCount}
          />
        )}
      </View>
    </View>
  );
};

export default connector(Home);
