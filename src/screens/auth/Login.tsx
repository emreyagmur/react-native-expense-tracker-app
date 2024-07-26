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
import {Eye, EyeOff, Mail, KeyRound, LogIn} from 'lucide-react-native';
import i18n from '../../lang/_i18n';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {authActions, authErrorSelector, authPhaseSelector} from './_store/auth';
import {useDispatch, useSelector} from 'react-redux';

export type StackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProps = StackNavigationProp<StackParamList>;

const Login = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProps>();

  const loginPhase = useSelector(authPhaseSelector);
  const loginError = useSelector(authErrorSelector);

  const [showPass, setShowPass] = React.useState(false);

  const [emailText, setEmailText] = React.useState('');
  const [passwordText, setEPasswordText] = React.useState('');

  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const handleChangeEmail = (value: string) => {
    setEmailText(value);
    setEmailError('');
  };
  const handleChangePwd = (value: string) => {
    setEPasswordText(value);
    setPasswordError('');
  };

  const loginUser = () => {
    if (emailText != '' && passwordText != '') {
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

      if (reg.test(emailText) === false) {
        setEmailError(i18n.t('invalid_email_address'));
        return false;
      }

      dispatch(authActions.login(emailText, passwordText));
    } else {
      if (emailText == '') {
        setEmailError(i18n.t('cannot_be_empty'));
      } else setPasswordError('');

      if (passwordText == '') {
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
              returnKeyType="done"
              error={passwordError ? true : false}
              value={passwordText}
              onChangeText={text => handleChangePwd(text)}
              mode="outlined"
              theme={{roundness: 10}}
              placeholder={i18n.t('password')}
              secureTextEntry={!showPass ? true : false}
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

        {loginError === 'api_error' && (
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
          disabled={loginPhase === 'loading' ? true : false}
          icon={() =>
            loginPhase === 'loading' ? (
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
          onPress={() => loginUser()}>
          {loginPhase === 'loading' ? i18n.t('loggingin') : i18n.t('login')}
        </Button>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text variant="titleMedium" style={{textAlign: 'center'}}>
            {i18n.t('dont_have_an_account')}{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text variant="titleMedium" style={{color: theme.colors.primary}}>
              {i18n.t('register')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
