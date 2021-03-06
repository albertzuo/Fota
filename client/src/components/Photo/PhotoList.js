/******************************************************************************
 * Called by: Base,
 * Dependencies: lodash, redux, common/Spinner, helpers/axioshelper,
 * Photo/PhotoDetail, Headbar, actions/getPhotosAndRests, actions/loadingTrue
 *
 * Description: The home page. Retrieves and displays a list of nearby photos
 * from the server (radius set by user through settings page), as well as a
 * list of liked/disliked photos by the user from either the server or the
 * device depending on whether or not the user is logged in. Pulling up past
 * the top refreshes the list of photos.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { FlatList, View, AsyncStorage } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import request from '../../helpers/axioshelper';
import PhotoDetail from './PhotoDetail';
import Headbar from '../Headbar';
import { getPhotosAndRests, loadingTrue } from '../../actions/index';

class PhotoList extends Component {
  state = { likesLoading: true, refreshing: false, liked: null, disliked: null };

  componentWillMount() {
    this.getPhotoList();
  }

  getPhotoList() {
    if (!this.state.refreshing) {
      this.props.loadingTrue();
    }
    if (!this.props.loginState) {
      this.getLikedAndDislikedFromDevice().done();
    } else {
      this.getLikedAndDislikedFromServer().done();
    }
    navigator.geolocation.getCurrentPosition(position => {
      const lat = 40.34; // position.coords.latitude
      const lng = -74.656; // position.coords.longitude
      AsyncStorage.getItem('SearchRadius').then(radius => {
        this.props.getPhotosAndRests(this.props.sorting, lat, lng, parseInt(radius, 10));
        this.setState({ refreshing: false });
      });
    });
  }

  getLikedAndDislikedFromServer = async () => {
    try {
      request.get(`https://fotafood.herokuapp.com/api/user/${this.props.loginState.uid}`)
      .then((userInfo) => {
        let liked = userInfo.data.likedPhotoIds;
        let disliked = userInfo.data.dislikedPhotoIds;
        if (!liked) liked = [];
        if (!disliked) disliked = [];
        this.setState({ liked, disliked, likesLoading: false });
      })
      .catch(() => this.setState({ likesLoading: false }));
    } catch (error) {
      console.log(error);
    }
  }

  getLikedAndDislikedFromDevice = async () => {
    try {
      // await AsyncStorage.clear();
      const liked = await AsyncStorage.getItem('liked');
      const disliked = await AsyncStorage.getItem('disliked');
      this.setState({
        liked: JSON.parse(liked),
        disliked: JSON.parse(disliked),
        likesLoading: false
      });
    } catch (error) {
      console.log(error);
    }
  };

  // given an id of a picutre, returns "liked" if the user has liked it,
  // "disliked" if user has not liked it, and null if neither.
  findVote(id) {
    if (_.includes(this.state.liked, id)) return 'liked';
    if (_.includes(this.state.disliked, id)) return 'disliked';
    return null;
  }

  // Returns the restaurant associated with a given id
  findRestaurant(restaurantid) {
    for (let i = 0; i < this.props.restaurants.length; i++) {
      if (restaurantid === this.props.restaurants[i].id) {
        return this.props.restaurants[i];
      }
    }
    return null;
  }

  refreshListView() {
    this.setState({ refreshing: true }, () => this.getPhotoList());
    // this.setState({ refreshing: false });
  }

  renderPhoto(photo) {
    return (
      <PhotoDetail
        key={photo.item.id}
        photo={photo.item}
        vote={this.findVote(photo.item.id)}
        restaurant={this.findRestaurant(photo.item.RestaurantId)}
      />
    );
  }

  render() {
    if (this.props.loading || this.state.likesLoading) {
      return (
        <View>
          <Headbar />
          <Spinner visible color='#ff9700' />
        </View>
      );
    }
    return (
      <View>
        <FlatList
          data={this.props.photos}
          extraData={Headbar}
          keyExtractor={photo => photo.id}
          renderItem={photo => this.renderPhoto(photo)}
          ListHeaderComponent={() => <Headbar update={this.getPhotoList.bind(this)} />}
          onRefresh={() => this.refreshListView()}
          refreshing={this.state.refreshing}
          showVerticalScrollIndicator={false}
          windowSize={10}
        />
      </View>
    );
  }
}

function mapStateToProps({ photos, restaurants, loginState, loading, sorting }) {
  return { photos, restaurants, loginState, loading, sorting };
}

export default connect(mapStateToProps, { getPhotosAndRests, loadingTrue })(PhotoList);
