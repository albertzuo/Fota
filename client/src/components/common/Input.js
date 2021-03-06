/******************************************************************************
 * Called by: Account/LoginForm, Camera/CameraCommentsPage,
 * Camera/CameraLocationPage, ./CommentDisplayInput, Restaurant/CommentUpload,
 * Restaurant/RestaurantDetail, Search/SearchPage
 * Dependencies:
 *
 * Description: Visual component for entering text.
 *
 ******************************************************************************/

import React from 'react';
import { View, TextInput } from 'react-native';

const Input = ({ style, children, placeholder, secure, value, onChangeText }) => (
  <View style={{ ...style, ...styles.containerStyle }}>
    {children}
    <TextInput
      style={styles.inputStyle}
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
      autoCorrect={false}
      secureTextEntry={secure}
      underlineColorAndroid={'transparent'}
    />
  </View>
);

const styles = {
  inputStyle: {
    fontFamily: 'Avenir',
    padding: 1,
    borderRadius: 3,
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 16,
    flex: 1
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export { Input };
