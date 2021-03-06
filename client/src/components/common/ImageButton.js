/******************************************************************************
 * Called by: Camera/CameraCommentsPage, Camera/CameraLoginForm,
 * Camera/CameraPage, Navbar, Photo/PhotoDetail, Restaurant/CommentUpload,
 * Restaurant/NounDetail, Restaurant/RestaurantDetail
 * Dependencies:
 *
 * Description: An image button.
 *
 ******************************************************************************/

import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

const ImageButton = ({ style, onPress, source, activeOpacity }) => (
  <TouchableOpacity
    style={style}
    onPress={onPress}
    activeOpacity={activeOpacity}
  >
    <Image
      style={{
        width: style.width,
        height: style.height,
        resizeMode: 'cover',
        borderRadius: style.borderRadius
      }}
      source={source}
    />
  </TouchableOpacity>
);

export { ImageButton };
