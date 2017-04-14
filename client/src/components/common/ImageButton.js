import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

// style={{
//   width: style.width,
//   height: style.height,
//   flex: style.flex,
//   marginLeft: style.marginLeft,
//   marginRight: style.marginRight,
//   padding: style.padding,
//   backgroundColor: '#f00'
// }}

const ImageButton = ({ style, onPress, source, activeOpacity }) => (
  <TouchableOpacity
    style={style}
    hitSlop={{ left: 5, right: 5 }}
    onPress={onPress}
    activeOpacity={activeOpacity}
  >
    <Image
      style={{ width: style.width,
               height: style.height,
               resizeMode: 'cover',
               borderRadius: style.borderRadius
              }}
      source={source}
    />
  </TouchableOpacity>
);

export { ImageButton };
