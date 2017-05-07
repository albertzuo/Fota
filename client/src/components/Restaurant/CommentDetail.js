import React, { Component } from 'react';
import { Navigator, FlatList, TouchableOpacity } from 'react-native';
import NounDetail from './NounDetail';
import { CommentDisplay } from '../common';

class CommentDetail extends Component {
  renderScene(route, navigator) {
    if (route.noun) {
      return <NounDetail noun={route.noun} navigator={navigator} />;
    }
    return (
      <FlatList
        style={{ alignSelf: 'center' }}
        data={this.props.nouns}
        keyExtractor={noun => noun.noun}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={noun => this.renderNoun(noun.item, navigator)}
        bounces={false}
      />
    );
  }

  renderNoun(noun, navigator) {
    const commentString = `${noun.adj[0].word} ${noun.noun}`;
    return (
      <TouchableOpacity onPress={() => navigator.push({ noun })}>
        <CommentDisplay text={commentString} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Navigator
        style={{ flex: 1, marginHorizontal: 10 }}
        initialRoute={{ noun: null }}
        renderScene={this.renderScene.bind(this)}
      />
    );
  }
}

export default CommentDetail;