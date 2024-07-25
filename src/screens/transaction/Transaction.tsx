import React from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import i18n from '../../lang/_i18n';
import {Calendar, Save} from 'lucide-react-native';
import DatePicker from 'react-native-date-picker';
import {AppDispatch, RootState} from '../../store/store';
import {IUser, authUserSelector, userLocaleSelector} from '../auth/_store/auth';
import {
  ITransaction,
  userTransactionsActions,
  userTransactionsPhaseSelector,
} from './_store/transaction';
import {ConnectedProps, connect, useDispatch} from 'react-redux';

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state),
  userLocale: userLocaleSelector(state),
  phase: userTransactionsPhaseSelector(state),
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TTransactionProps = PropsFromRedux;

export type StackParamList = {
  Main: undefined;
  Transaction: {type: string};
};

type NavigationProps = StackNavigationProp<StackParamList>;
type TransactionPageRouteProp = RouteProp<StackParamList, 'Transaction'>;

const Transaction: React.FC<TTransactionProps> = props => {
  const {user, userLocale, phase} = props;
  const dispatch = useDispatch();

  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<TransactionPageRouteProp>();
  const transactionType = route?.params.type;
  const theme = useTheme();

  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [openDate, setOpenDate] = React.useState(false);

  const [amount, setAmount] = React.useState('');
  const [amountError, setAmountError] = React.useState('');

  const [title, setTitle] = React.useState('');
  const [titleError, setTitleError] = React.useState('');

  const handleChangeAmount = (value: string) => {
    setAmount(value);
    setAmountError('');
  };

  const handleChangeTitle = (value: string) => {
    setTitle(value);
    setTitleError('');
  };

  const handleSaveTransaction = () => {
    console.log('asd');
    if (amount != '' && title != '') {
      dispatch(
        userTransactionsActions.addUserTransaction(
          {
            amount: amount.replace(',', '.'),
            title: title,
            type: transactionType,
            category_id: 1,
            created_at: selectedDate,
          },
          user,
        ),
      );
    } else {
      if (amount === '') setAmountError(i18n.t('cannot_be_empty'));
      else setAmountError('');

      if (title === '') setTitleError(i18n.t('cannot_be_empty'));
      else setTitleError('');
    }
  };

  React.useEffect(() => {
    if (phase === 'adding-success') {
      dispatch(userTransactionsActions.setPhase(null));
      navigation.goBack();
    }
  }, [phase]);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS == 'ios' ? 70 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 10,
        }}>
        <View style={{marginBottom: 15, gap: 10}}>
          <TextInput
            keyboardType="numeric"
            theme={{roundness: 10}}
            error={amountError ? true : false}
            value={amount}
            onChangeText={text => handleChangeAmount(text)}
            mode="outlined"
            placeholder={i18n.t('amount')}
          />
          {amountError && (
            <Text variant="labelSmall" style={{color: theme.colors.error}}>
              {amountError}
            </Text>
          )}
        </View>

        <View style={{marginBottom: 15, gap: 10}}>
          <TextInput
            theme={{roundness: 10}}
            error={titleError ? true : false}
            value={title}
            onChangeText={text => handleChangeTitle(text)}
            mode="outlined"
            placeholder={i18n.t('title')}
          />
          {titleError && (
            <Text variant="labelSmall" style={{color: theme.colors.error}}>
              {titleError}
            </Text>
          )}
        </View>

        <TouchableOpacity onPress={() => setOpenDate(true)}>
          <View style={{backgroundColor: theme.colors.background}}>
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
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Calendar
                    size={18}
                    style={{marginRight: 10}}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text variant="bodySmall">{i18n.t('date')}</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>
                    {selectedDate.toLocaleDateString(userLocale?.languageTag)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
            <DatePicker
              modal
              open={openDate}
              date={selectedDate}
              onConfirm={date => {
                setOpenDate(false);
                setSelectedDate(date);
              }}
              onCancel={() => {
                setOpenDate(false);
              }}
            />
          </View>
        </TouchableOpacity>

        <Button
          theme={{roundness: 2}}
          style={{
            height: 50,
            justifyContent: 'center',
            position: 'absolute',
            bottom: 50,
            width: '100%',
            left: 10,
          }}
          disabled={phase === 'loading' ? true : false}
          icon={() =>
            phase === 'loading' ? (
              <ActivityIndicator
                color={theme.colors.onPrimary}
                size={18}
                animating={true}
              />
            ) : (
              <Save size={18} color={theme.colors.onPrimary} />
            )
          }
          mode="contained"
          onPress={() => handleSaveTransaction()}>
          {phase === 'loading' ? i18n.t('please_wait') : i18n.t('save')}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default connector(Transaction);
