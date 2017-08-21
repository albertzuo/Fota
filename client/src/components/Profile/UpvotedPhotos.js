import React, { Component } from 'react';
import { View, FlatList, Dimensions, Image } from 'react-native';
import RestaurantModal from '../Restaurant/RestaurantModal';

const photoSize = (Dimensions.get('window').width - 56) / 3;

class UpvotedPhotos extends Component {
  renderPhoto(photo) {
    return (
      <RestaurantModal restaurantid={photo.rest_id}>
        <Image
          source={{ uri: photo.url }}
          style={styles.imageStyle}
        />
      </RestaurantModal>
    );
  }

  render() {
    return (
      <View style={{ marginHorizontal: 7 }} >
        <FlatList
          data={this.props.screenProps.upvoted}
          keyExtractor={photo => photo.id}
          renderItem={photo => this.renderPhoto(photo.item)}
          bounces={false}
          removeClippedSubviews={false}
          getItemLayout={(data, index) => (
            { length: photoSize, offset: photoSize * index, index }
          )}
          numColumns={3}
        />
      </View>
    );
  }
}

const styles = {
  imageStyle: {
    height: photoSize,
    width: photoSize,
    margin: 7,
    borderRadius: 5
  }
};

export default UpvotedPhotos;
