import React from 'react';
import {ChevronRight, LogOut, Banknote} from 'lucide-react-native';
import {TouchableOpacity, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  useTheme,
} from 'react-native-paper';
import {RootState} from 'src/store/store';
import {
  IUser,
  authActions,
  authPhaseSelector,
  authUserSelector,
} from '../auth/_store/auth';
import {ConnectedProps, connect, useDispatch} from 'react-redux';
import UserAvatar from '../../components/UserAvatar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import i18n from '../../lang/_i18n';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state),
  phase: authPhaseSelector(state),
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TAccountProps = PropsFromRedux;

export type StackParamList = {
  Currency: undefined;
  EditAccount: {user: IUser};
};

type NavigationProps = StackNavigationProp<StackParamList>;

const Account: React.FC<TAccountProps> = props => {
  const {user, phase} = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();
  const [isLoading, setLoading] = React.useState<boolean>(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(authActions.logout());
      setLoading(false);
    }, 1500);
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingTop: insets.top,
      }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('EditAccount', {user: user})}>
        <View style={{padding: 10, backgroundColor: theme.colors.background}}>
          <Card mode="outlined">
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
                <UserAvatar user={user} size={35} />
                <View>
                  <Text variant="bodyMedium">{user?.name}</Text>
                  <Text variant="bodySmall">{user?.email}</Text>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ChevronRight size={18} color={theme.colors.onSurfaceVariant} />
              </View>
            </Card.Content>
          </Card>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Currency')}>
        <View style={{padding: 10, backgroundColor: theme.colors.background}}>
          <Card mode="outlined">
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
                <Banknote
                  size={18}
                  style={{marginRight: 10}}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text variant="bodySmall">{i18n.t('currency')}</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ChevronRight size={18} color={theme.colors.onSurfaceVariant} />
              </View>
            </Card.Content>
          </Card>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <View style={{padding: 10, backgroundColor: theme.colors.background}}>
          <Card>
            <Card.Content
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {isLoading ? (
                  <ActivityIndicator
                    color={theme.colors.error}
                    size={18}
                    animating={true}
                  />
                ) : (
                  <>
                    <LogOut
                      size={18}
                      style={{marginRight: 10}}
                      color={theme.colors.error}
                    />
                    <Text
                      variant="bodySmall"
                      style={{color: theme.colors.error}}>
                      Sign out
                    </Text>
                  </>
                )}
              </View>
            </Card.Content>
          </Card>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default connector(Account);
