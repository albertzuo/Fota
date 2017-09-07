import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PhotoList from './PhotoList';
import LoadingPhotos from './LoadingPhotos';

class PhotoFeed extends Component {
  render() {
    if (this.props.loading) return <LoadingPhotos />;
    return (
      <View style={{ flex: 1, borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.09)' }} >
        <PhotoList
          list={this.props.list}
          onRefresh={this.props.refreshPhotos}
          refreshing={this.props.refreshing}
          shouldRenderWithRedux
        />
      </View>
    );
  }
}

function mapStateToProps({ loading }) {
  return { loading };
}

export default connect(mapStateToProps)(PhotoFeed);
