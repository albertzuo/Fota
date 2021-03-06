/******************************************************************************
 * Called by: Account/UserPage, Photo/PhotoDetail, Search/SearchPage
 * Dependencies: common/CardSection, ./RestaurantDetail, ./CommentUpload
 *
 * Description: Either returns a pop-up (long press) or a Navigator component
 * for switching between the different restaurant pages. Displayed when the user
 * taps a picture (Account/UserPage, Photo/PhotoDetail) or selects a restaurant
 * (Search/SearchPage).
 *
 ******************************************************************************/

import React, { Component } from 'react';
import {
  Text, View, Modal, Navigator,
  TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { CardSection } from '../common';
import RestaurantDetail from './RestaurantDetail';
import CommentUpload from './CommentUpload';

class RestaurantModal extends Component {
  state = { modalVisible: false, longPressed: false }

  onPressed(long) {
    if (long) {
      if (this.props.options) {
        this.setState({ longPressed: true }, () => this.setModalVisible(true));
      }
    } else if (this.state.longPressed) {
      this.setState({ longPressed: false }, () => this.setModalVisible(true));
    } else {
      this.setModalVisible(true);
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  renderScene(route, navigator) {
    switch (route.id) {
      case 0:
        return (
          <RestaurantDetail
            navigator={navigator}
            restaurant={this.props.restaurant}
            close={this.closeModal.bind(this)}
          />
        );
      case 1:
        return (
          <CommentUpload
            restaurant={this.props.restaurant}
            navigator={navigator}
          />
        );
      default:
        return (
          <RestaurantDetail
            navigator={navigator}
            restaurant={this.props.restaurant}
            close={this.closeModal.bind(this)}
          />
        );
    }
  }

  renderOptions() {
    return this.props.options.map(option => (
      <TouchableOpacity
        key={option.name}
        activeOpacity={0.9}
        onPress={() => {
          this.setModalVisible(false);
          option.onClick();
        }}
      >
        <CardSection>
          <Text style={styles.popupTextStyle}>{option.name}</Text>
        </CardSection>
      </TouchableOpacity>

    ));
  }

  renderPopup() {
    if (this.state.longPressed) {
      return (
        <TouchableWithoutFeedback onPress={() => { this.setModalVisible(false); }}>
          <View style={styles.modalStyle}>
            <View style={styles.popupStyle}>
              {this.renderOptions()}
            </View>
          </View>
        </TouchableWithoutFeedback>

      );
    }
    return (
      <View style={styles.modalStyle}>
        <Navigator
          style={{ flex: 1, backgroundColor: '#fff', ...this.props.pageStyle }}
          initialRoute={{ id: 0 }}
          renderScene={this.renderScene.bind(this)}
        />
      </View>
    );
  }

  render() {
    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false); }}
        >
          {this.renderPopup()}
        </Modal>

        <TouchableWithoutFeedback
          onPress={() => this.onPressed(false)}
          onLongPress={() => this.onPressed(true)}
        >
          {this.props.children}
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = {
  modalStyle: { // For the faded out part
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  popupStyle: {
    marginHorizontal: 20,
  },
  popupTextStyle: {
    fontSize: 17,
    padding: 5
  }
};

export default RestaurantModal;
