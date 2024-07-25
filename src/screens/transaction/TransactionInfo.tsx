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
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import i18n from '../../lang/_i18n';
import {Calendar, Save, Trash2} from 'lucide-react-native';
import DatePicker from 'react-native-date-picker';
import {RootState} from '../../store/store';
import {userLocaleSelector} from '../auth/_store/auth';
import {
  ITransaction,
  userTransactionsActions,
  userTransactionsPhaseSelector,
} from './_store/transaction';
import {ConnectedProps, connect, useDispatch} from 'react-redux';

const mapStateToProps = (state: RootState) => ({
  userLocale: userLocaleSelector(state),
  phase: userTransactionsPhaseSelector(state),
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TTransactionProps = PropsFromRedux;

export type StackParamList = {
  Main: undefined;
  TransactionInfo: {item: Partial<ITransaction>};
};

type NavigationProps = StackNavigationProp<StackParamList>;
type TransactionPageRouteProp = RouteProp<StackParamList, 'TransactionInfo'>;

const TransactionInfo: React.FC<TTransactionProps> = props => {
  const {userLocale, phase} = props;
  const dispatch = useDispatch();

  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<TransactionPageRouteProp>();
  const transactionInfo = route?.params.item;
  console.log(transactionInfo);
  const theme = useTheme();

  const [selectedDate, setSelectedDate] = React.useState(
    new Date(transactionInfo?.transaction_date),
  );
  const [openDate, setOpenDate] = React.useState(false);

  const [amount, setAmount] = React.useState(transactionInfo.amount.toString());
  const [amountError, setAmountError] = React.useState('');

  const [title, setTitle] = React.useState(transactionInfo.title);
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
    if (amount != '' && title != '') {
      dispatch(
        userTransactionsActions.updateUserTransaction({
          id: transactionInfo.id,
          amount: amount.replace(',', '.'),
          type: transactionInfo.type,
          title: title,
          transaction_date: selectedDate,
        }),
      );
    } else {
      if (amount === '') setAmountError(i18n.t('cannot_be_empty'));
      else setAmountError('');

      if (title === '') setTitleError(i18n.t('cannot_be_empty'));
      else setTitleError('');
    }
  };

  const handleDeleteTransaction = () => {
    dispatch(userTransactionsActions.deleteUserTransaction(transactionInfo.id));
  };

  React.useEffect(() => {
    if (phase === 'updating-success' || phase === 'delete-success') {
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
            multiline
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
            marginTop: 20,
            height: 50,
            justifyContent: 'center',
            width: '100%',
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

        <Button
          buttonColor={theme.colors.error}
          theme={{roundness: 2}}
          style={{
            height: 50,
            justifyContent: 'center',
            position: 'absolute',
            bottom: 50,
            width: '100%',
            left: 10,
          }}
          disabled={phase === 'delete-loading' ? true : false}
          icon={() =>
            phase === 'delete-loading' ? (
              <ActivityIndicator
                color={theme.colors.onPrimary}
                size={18}
                animating={true}
              />
            ) : (
              <Trash2 size={18} color={theme.colors.onPrimary} />
            )
          }
          mode="contained"
          onPress={() => handleDeleteTransaction()}>
          {phase === 'delete-loading'
            ? i18n.t('please_wait')
            : i18n.t('delete')}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default connector(TransactionInfo);
