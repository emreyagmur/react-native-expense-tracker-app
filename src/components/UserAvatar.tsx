import React from 'react';
import {IUser} from '../screens/auth/_store/auth';
import {Avatar} from 'react-native-paper';

type Props = {
  user: IUser;
  size: number;
};

const UserAvatar = (props: Props) => {
  const {user, size} = props;

  const trtoen = (username: string) => {
    return username
      .replace('Ğ', 'G')
      .replace('Ü', 'U')
      .replace('Ş', 'S')
      .replace('İ', 'I')
      .replace('Ö', 'O')
      .replace('Ç', 'C')
      .replace('ğ', 'g')
      .replace('ü', 'u')
      .replace('ş', 's')
      .replace('ı', 'i')
      .replace('ö', 'o')
      .replace('ç', 'c');
  };

  var str = user?.name ? trtoen(user?.name) : 'U';
  var matches = str.match(/\b(\w)/g);
  var acronym = matches.join('');

  return (
    <Avatar.Text
      size={size}
      label={acronym.toUpperCase()}
      style={{marginRight: 10}}
    />
  );
};

export default UserAvatar;
