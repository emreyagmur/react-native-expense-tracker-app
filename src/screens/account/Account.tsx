import React from 'react';
import {User, ChevronRight, LogOut} from 'lucide-react-native';
import {TouchableOpacity, View} from 'react-native';
import {Avatar, Card, List, Text, useTheme} from 'react-native-paper';

const Account = () => {
  const theme = useTheme();
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
              <Avatar.Text size={90} label="EY" style={{marginRight: 10}} />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
              }}>
              <Text variant="bodyMedium">Emre Yagmur</Text>
              <Text variant="bodySmall">y.emreyagmur@gmail.com</Text>
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
                <LogOut
                  size={18}
                  style={{marginRight: 10}}
                  color={theme.colors.error}
                />
                <Text variant="bodySmall" style={{color: theme.colors.error}}>
                  Sign out
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ChevronRight size={18} color={theme.colors.error} />
              </View>
            </Card.Content>
          </Card>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Account;
