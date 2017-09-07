/******************************************************************************
 * Called by: CameraCommentsPage, CameraLocationPage, CameraNavigator
 * Dependencies: redux, react-native-camera, ImageResizer, RNFetchBlob,
 * common/Header, common/ImageButton, actions/setCameraState
 *
 * Description: Step 1 of 3 in uploading a photo. Displays the camera to the
 * user. Exiting the camera brings the user back to the previous page the user
 * was at, and taking a picture brings the user to the location page
 * (./CameraLocationPage).
 *
 * Bugs/Todo: Resizing images on front end takes a long time. When pressing
 * cancel, figure out how to change from .navigate('Home') to
 * .dispatch(backAction) or .goBack()
 *
 ******************************************************************************/

import React, { Component } from 'react';
import {
  View, Text, AsyncStorage, TouchableWithoutFeedback, Keyboard,
  LayoutAnimation
} from 'react-native';
import { connect } from 'react-redux';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
import firebase from 'firebase';
import LoginInput from './LoginInput';
import { loginStyles } from './LoginPage';
import { Spinner, Button } from '../common';
import request from '../../helpers/axioshelper';
import { changeNameRequest } from '../../helpers/URL';

class SignupForm extends Component {
  state = { first: '', last: '', email: '', pass: '', error: '', loading: false, displayFirst: true };

  onSignupButtonPress() {
    const { email, pass } = this.state;

    this.setState({ error: '', loading: true });

    if (this.props.loginState && this.props.loginState.isAnonymous) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, pass);
      this.props.loginState.linkWithCredential(credential)
      .then(this.onCreateUserSuccess.bind(this))
      .catch(this.onCreateUserFail.bind(this));
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, pass)
      .then(this.onCreateUserSuccess.bind(this))
      .catch(this.onCreateUserFail.bind(this));
    }
  }

  onCreateUserSuccess(user) {
    const displayName = `${this.state.first} ${this.state.last}`;
    user.updateProfile({ displayName });
    this.setState({ first: '', last: '', email: '', pass: '', loading: false });
    if (this.props.screenProps.onLoginFinished) {
      this.props.screenProps.onLoginFinished();
    }
  }

  onCreateUserFail(error) {
    let message = 'Authentication error.';
    if (error.code === 'auth/email-already-in-use') {
      message = 'Email is already in use.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email.';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password is too weak.';
    }
    this.setState({ error: message, loading: false });
  }

  shouldBlur() {
    const { first, last, email, pass } = this.state;
    if (first.length > 0 && last.length > 0 && email.length > 0 && pass.length > 0) return true;
    return false;
  }

  shouldDisplayFirst() {
    if (this.state.displayFirst) {
      return (
        <View style={{ paddingRight: 75 }}>
          <LoginInput
            label='First Name'
            autoCapitalize='words'
            value={this.state.first}
            onChangeText={first => this.setState({ first })}
            onSubmitEditing={() => this.lastNameInput.focus()}
          />
        </View>
      );
    }
    return <View />;
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="large" />;
    }
    if (this.state.first.length > 0 && this.state.last.length > 0
        && this.state.email.length > 0 && this.state.pass.length > 0) {
      return (
        <Button
          onPress={this.onSignupButtonPress.bind(this)}
          colors={{ text: '#2494ff', fill: '#fff', border: '#fff' }}
          text={'DONE'}
        />
      );
    }
    return (
      <Button
        onPress={() => {}}
        colors={{ text: 'rgba(0,0,0,0.3)', fill: '#fff', border: '#fff' }}
        text={'DONE'}
      />
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={loginStyles.pageStart}>
            <View style={loginStyles.header}>
              <Ionicon.Button
                name='ios-arrow-back'
                backgroundColor='#fff'
                color='rgba(0, 0, 0, 0.75)'
                size={28}
                onPress={() => this.props.navigation.dispatch(NavigationActions.back())}
              />
              <Text style={loginStyles.headerText}>Sign up</Text>
            </View>

            {this.shouldDisplayFirst()}
            <View style={{ paddingRight: 75 }}>
              <LoginInput
                ref={lastNameInput => { this.lastNameInput = lastNameInput; }}
                label='Last Name'
                autoCapitalize='words'
                value={this.state.last}
                onChangeText={last => this.setState({ last })}
                onSubmitEditing={() => this.emailInput.focus()}
              />
            </View>
            <LoginInput
              ref={emailInput => { this.emailInput = emailInput; }}
              label='Email'
              keyboardType='email-address'
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              onSubmitEditing={() => this.passwordInput.focus()}
            />
            <LoginInput
              ref={passwordInput => { this.passwordInput = passwordInput; }}
              label='Password'
              value={this.state.pass}
              onChangeText={pass => this.setState({ pass })}
              blurOnSubmit={this.shouldBlur()}
              onBlur={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                this.setState({ displayFirst: true });
              }}
              onFocus={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                this.setState({ displayFirst: false });
              }}
              returnKeyType={'go'}
              onSubmitEditing={() => {
                if (this.state.email.length > 0 && this.state.pass.length > 0) {
                  this.onSignupButtonPress();
                } else {
                  this.setState({ error: 'Please fill in all fields before submitting.' });
                }
              }}
              secure
            />

            <View>
              <Text style={loginStyles.small}>
                By signing up, I agree to Fota's Terms of Service and Privacy Policy.
              </Text>
            </View>
            <Text style={loginStyles.error}>{this.state.error}</Text>
          </View>

          <View style={loginStyles.doneButton}>
            {this.renderButton()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

function mapStateToProps({ loginState }) {
  return { loginState };
}


export default connect(mapStateToProps)(SignupForm);
