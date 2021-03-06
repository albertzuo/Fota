/******************************************************************************
 * Called by: Base
 * Dependencies: redux, common/ImageButton, common/Footer
 *
 * Description: Bottom navigation bar. Leads to the home page (Photo/PhotoList),
 * the search page (Search/SearchPage), the camera page (Camera/CameraNavigator),
 * the account page (Account/AccountPage), or the settings page
 * (Settings/SettingsPage).
 *
 ******************************************************************************/

// Navigation bar at the bottom

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ImageButton, Footer } from './common';
import { footerSize, circleSize } from './common/Footer';
import { setCameraState, setNavigator } from '../actions';

const styles = {
  imgStyle: {
    width: footerSize - 25,
    height: footerSize - 25
  },
  camImgStyle: {
    width: circleSize - 20,
    height: circleSize - 20
  }
};

const { imgStyle, camImgStyle } = styles;

const homeActivated = require('../img/fota_home_activated.png');
const homeUnactivated = require('../img/fota_home_unactivated.png');
const searchActivated = require('../img/magnifying_glass_activated.png');
const searchUnactivated = require('../img/magnifying_glass_unactivated.png');
const accountActivated = require('../img/account_activated.png');
const accountUnactivated = require('../img/account_unactivated.png');
const settingsActivated = require('../img/settings_activated.png');
const settingsUnactivated = require('../img/settings_unactivated.png');
const cameraButton = require('../img/camera_button.png');

class Navbar extends Component {
  state = {
    homeSource: homeActivated,
    searchSource: searchUnactivated,
    accountSource: accountUnactivated,
    settingsSource: settingsUnactivated,
  }

  componentWillMount() {
    this.props.setNavigator(this);
  }

  /*getTransition(current, next) {
    if next > current
  }*/

  renderHome() {
    if (this.props.navigator.getCurrentRoutes().pop().id === 0) return;
    this.setState({
      homeSource: homeActivated,
      searchSource: searchUnactivated,
      accountSource: accountUnactivated,
      settingsSource: settingsUnactivated,
    });
    this.props.navigator.replace({ id: 0 });
  }

  renderSearch() {
    if (this.props.navigator.getCurrentRoutes().pop().id === 1) return;
    this.setState({
      homeSource: homeUnactivated,
      searchSource: searchActivated,
      accountSource: accountUnactivated,
      settingsSource: settingsUnactivated,
    });
    this.props.navigator.replace({ id: 1 });
  }

  renderAccount() {
    if (this.props.navigator.getCurrentRoutes().pop().id === 2) return;
    this.setState({
      homeSource: homeUnactivated,
      searchSource: searchUnactivated,
      accountSource: accountActivated,
      settingsSource: settingsUnactivated,
    });
    this.props.navigator.replace({ id: 2 });
  }

  renderSettings() {
    if (this.props.navigator.getCurrentRoutes().pop().id === 3) return;
    this.setState({
      homeSource: homeUnactivated,
      searchSource: searchUnactivated,
      accountSource: accountUnactivated,
      settingsSource: settingsActivated,
    });
    this.props.navigator.replace({ id: 3 });
  }

  renderCamera() {
    this.props.setCameraState(true);
  }

  render() {
    return (
      <Footer>
        <ImageButton
          onPress={() => this.renderHome()}
          source={this.state.homeSource}
          style={imgStyle}
        />
        <ImageButton
          onPress={() => this.renderSearch()}
          source={this.state.searchSource}
          style={imgStyle}
        />
        <ImageButton
          onPress={() => this.renderCamera()}
          source={cameraButton}
          style={camImgStyle}
        />
        <ImageButton
          onPress={() => this.renderAccount()}
          source={this.state.accountSource}
          style={imgStyle}
        />
        <ImageButton
          onPress={() => this.renderSettings()}
          source={this.state.settingsSource}
          style={imgStyle}
        />
      </Footer>
    );
  }
}

export default connect(null, { setCameraState, setNavigator })(Navbar);
