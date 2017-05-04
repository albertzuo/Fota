import React from 'react';
import { TextInput, View } from 'react-native';

const CommentDisplayInput = ({ placeholder, value, onChangeText, secure, onSubmitEditing }) => {
return (
    <View style={styles.containerStyle}>
      <TextInput
        style={styles.inputStyle}
        value={value}
        defaultValue={placeholder}
        placeholder={placeholder}
        placeholderTextColor='white'
        onChangeText={onChangeText}
        autoCorrect={false}
        secureTextEntry={secure}
        underlineColorAndroid={'transparent'}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
);
};

const styles = {
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'orange',
    paddingHorizontal: 12,
    borderRadius: 16,
    height: 32,
    marginLeft: 5,
    marginRight: 5
  },
  inputStyle: {
    padding: 1,
    borderRadius: 3,
    color: 'white',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 12,
    fontFamily: 'Avenir',
    flex: 1,
    textAlign: 'center'
  },
};

export { CommentDisplayInput };
