/******************************************************************************
 * Called by: ./PhotoList
 * Dependencies: redux, helpers/axioshelper, helpers/getasyncstorage,
 * common/ImageButton, Restaurant/RestaurantModal
 *
 * Description: Visual component for each photo on the home page. Consists of
 * the photo frame, upvote/downvote button and logic, and the upvote count.
 *
 * After a user votes on the photo, sends upvote/downvote information along
 * with the user/phone ID depending on whether the user is logged in or not.
 * Tapping a photo brings up the restaurant page (Restaurant/RestaurantModal)
 * associated with the photo. Long pressing the photo brings up a "Report as
 * Spam" option (done through Restaurant/RestaurantModal).
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, Image, Text, Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux';
import request from '../../helpers/axioshelper';
import { ImageButton } from '../common';
import RestaurantModal from '../Restaurant/RestaurantModal';
import saveVote from '../../helpers/getasyncstorage';

const styles = {
  photoStyle: { // The picture
    flex: 1,
    width: null,
    height: Dimensions.get('window').width
  },
  restaurantPageStyle: { // Entire restaurant page
    marginVertical: 20,
    marginHorizontal: 15
  },
  photoInfoStyle: {
    marginTop: 10,
    marginBottom: 25,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative'
  },
  upvoteStyle: { // Upvote/downvote
    height: 35,
    width: 35
  },
  downvoteStyle: { // Downvote
    height: 35,
    width: 35,
    marginLeft: 20,
    marginRight: 10
  },
  likeCountContainerStyle: { // Upvote arrow + number of likes container
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10
  },
  likeCountArrowStyle: { // the arrow next to number of likes
    height: 13,
    width: 13
  },
  likeCountTextStyle: { // Number of likes
    fontFamily: 'Avenir',
    color: '#bababa',
    fontSize: 13,
    textAlign: 'justify',
    fontWeight: 'bold',
    marginLeft: 5
  },
  likeContainerStyle: { // Upvote/downvote container
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
};

const {
  photoStyle,
  restaurantPageStyle,
  photoInfoStyle,
  upvoteStyle,
  downvoteStyle,
  likeCountContainerStyle,
  likeCountArrowStyle,
  likeCountTextStyle,
  likeContainerStyle
} = styles;

const upvoteUnactivated = require('../../img/upvote_unactivated.png');
const upvoteActivated = require('../../img/upvote_activated.png');
const downvoteUnactivated = require('../../img/downvote_unactivated.png');
const downvoteActivated = require('../../img/downvote_activated.png');

class PhotoDetail extends Component {
  constructor(props) {
    super(props);
    if (!props.vote) {
      this.state = {
        link: props.photo.link,
        likecount: props.photo.likecount,
        id: props.photo.id,
        userLiked: false,
        userDisliked: false,
        upvoteSource: upvoteUnactivated,
        downvoteSource: downvoteUnactivated,
        userHasVoted: false,
        modalVisible: false
      };
    } else if (props.vote === 'liked') {
        this.state = {
          link: props.photo.link,
          likecount: props.photo.likecount,
          id: props.photo.id,
          userLiked: true,
          userDisliked: false,
          upvoteSource: upvoteActivated,
          downvoteSource: downvoteUnactivated,
          userHasVoted: true,
          modalVisible: false
        };
    } else if (props.vote === 'disliked') {
        this.state = {
          link: props.photo.link,
          likecount: props.photo.likecount,
          id: props.photo.id,
          userLiked: false,
          userDisliked: true,
          upvoteSource: upvoteUnactivated,
          downvoteSource: downvoteActivated,
          userHasVoted: true,
          modalVisible: false
        };
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  // Sends the update request to the fota server.
  // type can either be "downvote" or "upvote"
  sendUpdateRequest(type, amount) {
    const user = this.props.loginState;
    let queryString = '';
    if (!user) {
      queryString = `https://fotafood.herokuapp.com/api/photo/${this.state.id}?type=${type}&amount=${amount}`;
    } else {
      queryString = `https://fotafood.herokuapp.com/api/photo/${this.state.id}?type=${type}&amount=${amount}&user=${user.uid}`;
    }
    request.patch(queryString)
    .catch(e => request.showErrorAlert(e));
  }

  renderUpvote() {
    let newLikeCount = this.state.likecount;
    let userNewLike = true;
    let userVoted = true;
    let voteSource = upvoteActivated;
    if (!this.state.userHasVoted) {
      newLikeCount += 1;
      saveVote(1, this.state.id).done();
      this.sendUpdateRequest('upvote', '1');
    } else if (this.state.userDisliked) {
        newLikeCount += 2;
        saveVote(4, this.state.id).done();
        this.sendUpdateRequest('upvote', '2');
    } else if (this.state.userLiked) {
        newLikeCount -= 1;
        userNewLike = false;
        userVoted = false;
        voteSource = upvoteUnactivated;
        saveVote(5, this.state.id).done();
        this.sendUpdateRequest('downvote', '1');
    }
    this.setState({
      likecount: newLikeCount,
      userLiked: userNewLike,
      userDisliked: false,
      userHasVoted: userVoted,
      upvoteSource: voteSource,
      downvoteSource: downvoteUnactivated
    });
  }

  renderDownvote() {
    let newLikeCount = this.state.likecount;
    let userHasDisliked = true;
    let userVoted = true;
    let voteSource = downvoteActivated;
    if (!this.state.userHasVoted) {
      newLikeCount -= 1;
      saveVote(2, this.state.id).done();
      this.sendUpdateRequest('downvote', '1');
    } else if (this.state.userLiked) {
      newLikeCount -= 2;
      saveVote(3, this.state.id).done();
      this.sendUpdateRequest('downvote', '2');
    } else if (this.state.userDisliked) {
      newLikeCount += 1;
      userHasDisliked = false;
      userVoted = false;
      voteSource = downvoteUnactivated;
      saveVote(6, this.state.id).done();
      this.sendUpdateRequest('upvote', 1);
    }
    this.setState({
      likecount: newLikeCount,
      userLiked: false,
      userDisliked: userHasDisliked,
      userHasVoted: userVoted,
      upvoteSource: upvoteUnactivated,
      downvoteSource: voteSource
    });
  }

  render() {
    return (
      <View>
        <RestaurantModal
          restaurant={this.props.restaurant}
          pageStyle={restaurantPageStyle}
          options={[{
            name: 'Report as Spam',
            onClick: () => setTimeout(() => Alert.alert(
                  '',
                  'This photo has been reported. Thanks for letting us know!',
                  [{ text: 'OK' }]
                ), 550)
          }]}
        >
          <Image
            style={photoStyle}
            source={{ uri: this.state.link }}
          />
        </RestaurantModal>

        <View style={photoInfoStyle}>
          <View style={likeCountContainerStyle}>
            <Image
              source={upvoteUnactivated}
              style={likeCountArrowStyle}
            />
          <Text style={likeCountTextStyle}>{this.state.likecount.toString()}</Text>
          </View>

          <View style={likeContainerStyle}>
            <ImageButton
              source={this.state.upvoteSource}
              style={upvoteStyle}
              onPress={() => this.renderUpvote()}
            />
            <ImageButton
              source={this.state.downvoteSource}
              style={downvoteStyle}
              onPress={() => this.renderDownvote()}
            />
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(PhotoDetail);
