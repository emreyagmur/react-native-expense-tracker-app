import React from 'react';
import {User, ChevronRight, LogOut} from 'lucide-react-native';
import {TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Card, Text, useTheme} from 'react-native-paper';
import {RootState} from 'src/store/store';
import {
  authActions,
  authPhaseSelector,
  authUserSelector,
} from '../auth/_store/auth';
import {ConnectedProps, connect, useDispatch} from 'react-redux';
import UserAvatar from '../../components/UserAvatar';

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state),
  phase: authPhaseSelector(state),
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TAccountProps = PropsFromRedux;

const Account: React.FC<TAccountProps> = props => {
  const {user, phase} = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = React.useState<boolean>(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(authActions.logout());
      setLoading(false);
    }, 1500);
  };

  return (
    <View style={{backgroundColor: theme.colors.background, flex: 1}}>
      <View style={{padding: 10, backgroundColor: theme.colors.background}}>
        <Card>
          <Card.Content>
            <View
              style={{
                alignItems: 'center',
                padding: 10,
              }}>
              <UserAvatar user={user} size={80} />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
              }}>
              <Text variant="bodyMedium">{user?.name}</Text>
              <Text variant="bodySmall">{user?.email}</Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      <TouchableOpacity>
        <View style={{padding: 10, backgroundColor: theme.colors.background}}>
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
                <User
                  size={18}
                  style={{marginRight: 10}}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text variant="bodySmall">Settings</Text>
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
