/******************************************************************************
 * Called by: Account/LoginForm, Camera/CameraCommentsPage,
 * Camera/CameraLocationPage, ./CommentDisplayInput, Restaurant/CommentUpload,
 * Restaurant/RestaurantDetail, Search/SearchPage
 * Dependencies:
 *
 * Description: Visual component for entering text.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';

class LoginInput extends Component {
  state = { hidePassword: true };

  focus() {
    this.textInput.focus();
  }

  renderShowHide() {
    if (this.props.secure) {
      return (
        <Text
          style={styles.showHideStyle}
          onPress={() => this.setState({ hidePassword: !this.state.hidePassword })}
        >
          {this.state.hidePassword ? 'SHOW' : 'HIDE'}
        </Text>
      );
    }
  }

  render() {
    const {
      label,
      secure,
      value,
      onChangeText,
      onBlur,
      onFocus,
      blurOnSubmit,
      keyboardType,
      autoCapitalize,
      onSubmitEditing,
      returnKeyType
    } = this.props;
    return (
      <View style={{ marginVertical: 15 }}>
        <Text style={styles.labelStyle}>{label}</Text>
        <View style={styles.containerStyle}>
          <TextInput
            ref={textInput => { this.textInput = textInput; }}
            style={styles.textStyle}
            value={value}
            onChangeText={onChangeText}
            onBlur={onBlur}
            onFocus={onFocus}
            blurOnSubmit={blurOnSubmit}
            autoCapitalize={autoCapitalize || 'none'}
            autoCorrect={false}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={returnKeyType || 'default'}
            secureTextEntry={secure ? this.state.hidePassword : false}
            underlineColorAndroid={'transparent'}
            keyboardType={keyboardType || 'default'}
          />
          {this.renderShowHide()}
        </View>
      </View>
    );
  }
}

const styles = {
  textStyle: {
    fontWeight: 'bold',
    padding: 0,
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 18,
    flex: 1,
  },
  showHideStyle: {
    fontWeight: 'bold',
    padding: 0,
    marginLeft: 10,
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 13,
  },
  labelStyle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 5
  },
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)'
  }
};

export default LoginInput;
