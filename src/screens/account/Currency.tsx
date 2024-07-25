import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Card, useTheme, Text} from 'react-native-paper';
import {ConnectedProps, connect, useDispatch} from 'react-redux';
import {
  authActions,
  authPhaseSelector,
  authUserSelector,
} from '../auth/_store/auth';
import {RootState} from '../../store/store';
import {
  ICurrency,
  currenciesPhaseSelector,
  currenciesSelector,
  currencyActions,
} from '../../store/currency';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {ChevronRight} from 'lucide-react-native';

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state),
  authPhase: authPhaseSelector(state),
  currencies: currenciesSelector(state),
  phase: currenciesPhaseSelector(state),
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TCurrencyProps = PropsFromRedux;

export type StackParamList = {
  Account: undefined;
};

type NavigationProps = StackNavigationProp<StackParamList>;

const Currency = (props: TCurrencyProps) => {
  const {user, currencies, authPhase, phase} = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation<NavigationProps>();

  const listCount = currencies?.length > 0 ? currencies.length : 1;

  const handleChangeCurrency = (c: ICurrency) => {
    dispatch(authActions.setCurrency(c, user));
  };

  React.useEffect(() => {
    if (authPhase === 'currency-updating-success') {
      navigation.goBack();
      dispatch(authActions.setPhase(null, null));
    }
  }, [authPhase]);

  React.useEffect(() => {
    dispatch(currencyActions.pullCurrencies());
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 10,
      }}>
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
          data={currencies}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{marginBottom: 10}}
              onPress={() => handleChangeCurrency(item)}>
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
                        gap: 5,
                      }}>
                      <Text variant="labelLarge">{item.symbol}</Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                          flex: 1,
                        }}>
                        <Text variant="labelLarge">{item.name}</Text>
                        <Text numberOfLines={1} variant="bodyMedium">
                          {'[' + item?.code + ']'}
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
  );
};

export default connector(Currency);
