import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {
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

export type StackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProps = StackNavigationProp<StackParamList>;

const Register = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const [showPass, setShowPass] = React.useState(false);
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
        <View style={{marginBottom: 40, gap: 10}}>
          <TextInput
            theme={{roundness: 10}}
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
          <TextInput
            theme={{roundness: 10}}
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

          <TextInput
            mode="outlined"
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
        </View>

        <Button
          theme={{roundness: 2}}
          style={{
            marginBottom: 20,
            height: 50,
            justifyContent: 'center',
          }}
          icon={() => <LogIn size={18} color={theme.colors.onPrimary} />}
          mode="contained"
          onPress={() => console.log('Pressed')}>
          {i18n.t('register')}
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
