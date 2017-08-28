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
 * Bugs/Todo: Change the order toggler (OrderToggler) to react navigation
 * instead of the current implementation.
 *
 ******************************************************************************/

import React from 'react';
import { View, Dimensions } from 'react-native';

const size = Dimensions.get('window').width - 60;

const LoadingPhotos = () => (
  <View style={{ borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.09)' }}>
    <View style={styles.grayPhotoStyle} />
    <View style={styles.grayPhotoStyle} />
  </View>
);

const styles = {
  grayPhotoStyle: {
    marginHorizontal: 30,
    marginVertical: 20,
    width: size,
    height: size,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.06)'
  }
};

export default LoadingPhotos;