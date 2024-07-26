import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {
  TextInput,
  useTheme,
  Text,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  IUser,
  authActions,
  authErrorSelector,
  authPhaseSelector,
} from '../auth/_store/auth';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Mail, Save, User} from 'lucide-react-native';
import i18n from '../../lang/_i18n';

export type StackParamList = {
  Account: undefined;
  EditAccount: {user: IUser};
};

type NavigationProps = StackNavigationProp<StackParamList>;
type TransactionPageRouteProp = RouteProp<StackParamList, 'EditAccount'>;

const EditAccount = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<TransactionPageRouteProp>();
  const user = route?.params.user;

  const authPhase = useSelector(authPhaseSelector);
  const authError = useSelector(authErrorSelector);

  const [nameText, setNameText] = React.useState(user?.name);
  const [emailText, setEmailText] = React.useState(user?.email);

  const [emailError, setEmailError] = React.useState('');
  const [nameError, setNameError] = React.useState('');

  const handleChangeName = (value: string) => {
    setNameText(value);
    setNameError('');
  };
  const handleChangeEmail = (value: string) => {
    setEmailText(value);
    setEmailError('');
  };

  const updateUser = () => {
    if (emailText !== '' && nameText !== '') {
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

      if (reg.test(emailText) === false) {
        setEmailError(i18n.t('invalid_email_address'));
        return false;
      }

      dispatch(authActions.updateUser(user, emailText, nameText));
    } else {
      if (nameText === '') {
        setNameError(i18n.t('cannot_be_empty'));
      } else setNameError('');

      if (emailText === '') {
        setEmailError(i18n.t('cannot_be_empty'));
      } else setEmailError('');
    }
  };

  React.useEffect(() => {
    if (authPhase === 'user-updating-success') {
      dispatch(authActions.setPhase(null, null));
      navigation.goBack();
    }
  }, [authPhase]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
          padding: 10,
        }}>
        <View style={{marginBottom: 30, gap: 10}}>
          <View style={{marginBottom: 15, gap: 10}}>
            <TextInput
              theme={{roundness: 10}}
              error={nameError ? true : false}
              value={nameText}
              onChangeText={text => handleChangeName(text)}
              mode="outlined"
              placeholder={i18n.t('name_lastname')}
              left={
                <TextInput.Icon
                  icon={() => (
                    <User size={18} color={theme.colors.onBackground} />
                  )}
                />
              }
            />
            {nameError && (
              <Text variant="labelSmall" style={{color: theme.colors.error}}>
                {nameError}
              </Text>
            )}
          </View>

          <View style={{marginBottom: 15, gap: 10}}>
            <TextInput
              theme={{roundness: 10}}
              error={emailError ? true : false}
              value={emailText}
              onChangeText={text => handleChangeEmail(text)}
              mode="outlined"
              placeholder={i18n.t('email')}
              left={
                <TextInput.Icon
                  icon={() => (
                    <Mail size={18} color={theme.colors.onBackground} />
                  )}
                />
              }
            />
            {emailError && (
              <Text variant="labelSmall" style={{color: theme.colors.error}}>
                {emailError}
              </Text>
            )}
          </View>
        </View>

        {authError === 'email_already_exist' && (
          <View>
            <Text
              variant="labelSmall"
              style={{
                color: theme.colors.error,
                textAlign: 'center',
                marginBottom: 10,
              }}>
              {i18n.t('email_already_exist')}
            </Text>
          </View>
        )}

        <Button
          theme={{roundness: 2}}
          style={{
            marginBottom: 20,
            height: 50,
            justifyContent: 'center',
          }}
          disabled={authPhase === 'user-updating' ? true : false}
          icon={() =>
            authPhase === 'user-updating' ? (
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
          onPress={() => updateUser()}>
          {authPhase === 'user-updating'
            ? i18n.t('please_wait')
            : i18n.t('save')}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditAccount;
