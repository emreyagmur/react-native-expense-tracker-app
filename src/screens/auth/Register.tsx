import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {Eye, EyeOff, User, KeyRound, LogIn, Mail} from 'lucide-react-native';
import i18n from '../../lang/_i18n';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  authActions,
  authErrorSelector,
  authPhaseSelector,
  userLocaleSelector,
} from './_store/auth';

export type StackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProps = StackNavigationProp<StackParamList>;

const Register = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const userLocale = useSelector(userLocaleSelector);
  const dispatch = useDispatch();

  const authPhase = useSelector(authPhaseSelector);
  const authError = useSelector(authErrorSelector);

  const [showPass, setShowPass] = React.useState(false);

  const [nameText, setNameText] = React.useState('');
  const [emailText, setEmailText] = React.useState('');
  const [passwordText, setEPasswordText] = React.useState('');

  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [nameError, setNameError] = React.useState('');

  const handleChangeName = (value: string) => {
    setNameText(value);
    setNameError('');
  };
  const handleChangeEmail = (value: string) => {
    setEmailText(value);
    setEmailError('');
  };
  const handleChangePwd = (value: string) => {
    setEPasswordText(value);
    setPasswordError('');
  };

  const registerUser = () => {
    if (emailText !== '' && passwordText !== '' && nameText !== '') {
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

      if (reg.test(emailText) === false) {
        setEmailError(i18n.t('invalid_email_address'));
        return false;
      }

      dispatch(
        authActions.register(nameText, emailText, passwordText, userLocale),
      );
    } else {
      if (nameText === '') {
        setNameError(i18n.t('cannot_be_empty'));
      } else setNameError('');

      if (emailText === '') {
        setEmailError(i18n.t('cannot_be_empty'));
      } else setEmailError('');

      if (passwordText === '') {
        setPasswordError(i18n.t('cannot_be_empty'));
      } else setPasswordError('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View
        style={{
          flex: 1,
          padding: 10,
          justifyContent: 'center',
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
          <View style={{marginBottom: 15, gap: 10}}>
            <TextInput
              mode="outlined"
              returnKeyType="done"
              error={passwordError ? true : false}
              value={passwordText}
              onChangeText={text => handleChangePwd(text)}
              theme={{roundness: 10}}
              placeholder={i18n.t('password')}
              secureTextEntry={showPass ? true : false}
              right={
                <TextInput.Icon
                  icon={() =>
                    showPass ? (
                      <IconButton
                        icon={() => (
                          <EyeOff size={18} color={theme.colors.onBackground} />
                        )}
                        size={20}
                        onPress={() => setShowPass(false)}
                      />
                    ) : (
                      <IconButton
                        icon={() => (
                          <Eye size={18} color={theme.colors.onBackground} />
                        )}
                        size={20}
                        onPress={() => setShowPass(true)}
                      />
                    )
                  }
                />
              }
              left={
                <TextInput.Icon
                  icon={() => (
                    <KeyRound size={18} color={theme.colors.onBackground} />
                  )}
                />
              }
            />
            {passwordError && (
              <Text variant="labelSmall" style={{color: theme.colors.error}}>
                {passwordError}
              </Text>
            )}
          </View>
        </View>

        {authError === 'api_error' && (
          <View>
            <Text
              variant="labelSmall"
              style={{
                color: theme.colors.error,
                textAlign: 'center',
                marginBottom: 10,
              }}>
              {i18n.t('api_error')}
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
          disabled={authPhase === 'loading' ? true : false}
          icon={() =>
            authPhase === 'loading' ? (
              <ActivityIndicator
                color={theme.colors.onPrimary}
                size={18}
                animating={true}
              />
            ) : (
              <LogIn size={18} color={theme.colors.onPrimary} />
            )
          }
          mode="contained"
          onPress={() => registerUser()}>
          {authPhase === 'loading' ? i18n.t('loggingin') : i18n.t('register')}
        </Button>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text variant="titleMedium" style={{textAlign: 'center'}}>
            {i18n.t('have_an_account')}{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text variant="titleMedium" style={{color: theme.colors.primary}}>
              {i18n.t('login')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;
