import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Header } from '../common';
import UserPage from './UserPage';
import LoginForm from './LoginForm';

class AccountPage extends Component {
  render() {
    if (this.props.loginState) {
      return <UserPage user={this.props.loginState} />;
    }
    return (
      <View>
        <Header><Text style={styles.headerTextStyle}>Log In</Text></Header>
        <LoginForm />
      </View>
    );
  }
}

const styles = {
  headerTextStyle: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Avenir',
    color: '#000'
  }
};

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(AccountPage);