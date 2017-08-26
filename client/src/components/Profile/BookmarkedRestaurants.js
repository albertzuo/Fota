import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Banner, FilterDisplay } from '../common';
import RestaurantModal from '../Restaurant/RestaurantModal';

const itemWidth = Dimensions.get('window').width / 2 - 40;
const PHOTO_BORDER_RADIUS = 7;

class BookmarkedRestaurants extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused }) => {
      let color = 'rgba(0, 0, 0, 0.2)';
      if (focused) {
        color = '#ff9700';  
      }
      return (
        <Icon
          name={'ios-bookmark'}
          color={color}
          size={30}
        />
      );
    }
  };

  renderFilters(rest) {
    return rest.categories.map((filterName, index) =>
      <FilterDisplay
        key={index}
        text={filterName.title}
        color='rgba(0, 0, 0, 0.6)'
        size={10}
      />
    );
  }

  renderRestaurant(rest) {
    const street = rest.location.display_address[0].replace(/^[0-9]* /, '');
    const address = `${street}, ${rest.location.city}`;
    return (
      <RestaurantModal restaurantid={rest.id}>
        <View style={styles.cardStyle}>
          <View style={{ borderRadius: PHOTO_BORDER_RADIUS, overflow: 'hidden', flex: 1 }}>
            <Banner
              photo={rest.photos === undefined ? undefined : rest.photos[0].url}
              containerStyle={{ height: 75 }}
              photoStyle={{ flex: 1 }}
            />
            <View style={{ marginHorizontal: 14, marginVertical: 10, flex: 1, justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.addressStyle}>{address}</Text>
                <Text style={styles.titleStyle}>{rest.name}</Text>
              </View>
              <Text style={styles.ratingStyle}>96%</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {this.renderFilters(rest)}
              </View>
            </View>
          </View>
        </View>
      </RestaurantModal>
    );
  }

  render() {
    return (
      <View style={{ marginHorizontal: 20 }}>
        <FlatList
          data={this.props.screenProps.bookmarked}
          keyExtractor={rest => rest.id}
          renderItem={rest => this.renderRestaurant(rest.item)}
          bounces={false}
          removeClippedSubviews={false}
          numColumns={2}
          style={{ paddingVertical: 10 }}
        />
      </View>
    );
  }
}

const styles = {
  cardStyle: {
    margin: 10,
    width: itemWidth,
    elevation: 2,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderRadius: PHOTO_BORDER_RADIUS,
    flex: 1
  },
  addressStyle: {
    fontSize: 11,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.6)'
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: '900',
    color: 'rgba(0, 0, 0, 0.75)',
    marginVertical: 7
  },
  ratingStyle: {
    fontSize: 14,
    fontWeight: '900',
    color: 'rgba(0, 0, 0, 0.6)',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 7,
    marginBottom: 7,
    width: 60
  }
};

export default BookmarkedRestaurants;
