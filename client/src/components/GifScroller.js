import qs from 'qs';
import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Image from 'react-native-image-progress';

import Settings from '../constants/Settings';

const apiKey = Settings.giphyAPI.debug;
export default class GifScroller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gifs: [],
      offset: 0,
    };
  }

  componentDidMount = () => {
    if (this.props.inputText === '') {
      this.buildUrl('trending', apiKey);
    } else {
      const searchTerm = this.props.inputText;
      this.buildUrl('search', apiKey, searchTerm, 5);
    }
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({ gifs: [], offset: 0 });
    if (nextProps.inputText === '') {
      this.buildUrl('trending', apiKey);
    } else {
      const searchTerm = nextProps.inputText;
      this.buildUrl('search', apiKey, searchTerm, 5);
    }
  };

  handleGifSelect = (index, url) => {
    if (this.props.handleGifSelect) {
      this.props.handleGifSelect(url);
    }
  };

  loadMoreImages = () => {
    this.state.offset += 10;
    this.buildUrl('search', apiKey, this.props.inputText, 5, this.state.offset);
  };

  buildUrl = (endpoint, apiKey, q, limit, offset) => {
    if (endpoint === 'trending') {
      const _endpoint = 'https://api.giphy.com/v1/gifs/trending?api_key=';
      const url = `${_endpoint}${apiKey}`;
      this.fetchAndRenderGifs(url);
    } else {
      const _endpoint = 'https://api.giphy.com/v1/gifs/search?';
      const query = qs.stringify({
        q,
        apiKey,
        limit,
        offset,
      });
      const url = `${_endpoint}${query}`;
      this.fetchAndRenderGifs(url);
    }
  };

  fetchAndRenderGifs = async (url) => {
    try {
      const response = await fetch(url);
      const gifs = await response.json();
      console.log('gifs', { gifs });
      const gifsUrls = gifs.data.map(gif => gif.images.fixed_height_downsampled.url);
      const newGifsUrls = this.state.gifs.concat(gifsUrls);
      if (newGifsUrls && Array.isArray(newGifsUrls)) {
        this.setState({ gifs: newGifsUrls });
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const imageList = this.state.gifs.map((gif, index) => (
      <TouchableOpacity onPress={() => this.handleGifSelect(index, gif)} key={`a-${index + 0}`} index={index}>
        <Image source={{ uri: gif }} style={styles.image} />
      </TouchableOpacity>
    ));
    return (
      <View style={this.props.style}>
        <FlatList
          horizontal
          style={styles.scroll}
          data={imageList}
          renderItem={({ item }) => item}
          onEndReached={this.loadMoreImages}
          onEndReachedThreshold={500}
          initialNumToRender={4}
          keyboardShouldPersistTaps="always"
        />
      </View>
    );
  }
}

GifScroller.defaultProps = {
  inputText: '',
};

const styles = StyleSheet.create({
  scroll: {
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 2,
    marginRight: 1,
  },
});
