/******************************************************************************
 * Called by: Restaurant/RestaurantDetail
 * Dependencies:
 *
 * Description: Visual component for displaying filter tags.
 *
 ******************************************************************************/

import React from 'react';
import { Text, View } from 'react-native';

const FilterDisplay = (props) => (
  <View style={styles.containerStyle}>
    <Text style={styles.textStyle}>
      {props.text}
    </Text>
  </View>
);


const styles = {
    containerStyle: {
      flex: -1,
      borderRadius: 20,
      backgroundColor: '#A9A9A9',
      alignItems: 'center',
      padding: 8,
      marginLeft: 5,
      marginRight: 5,
      marginTop: 5,
      marginBottom: 5
    },
    textStyle: {
      color: 'white',
      fontFamily: 'Avenir',
      fontSize: 12,
      marginLeft: 3,
      marginRight: 3,
      textAlign: 'justify'
    }
};

export { FilterDisplay };
