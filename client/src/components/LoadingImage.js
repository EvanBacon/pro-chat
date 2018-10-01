import React, { Component } from 'react';
// import {CachedImage} from "react-native-img-cache";
// import CachedImage from 'react-native-cached-image';
// import { createImageProgress } from 'react-native-image-progress';
// import FastImage from 'react-native-fast-image';

import Colors from '../constants/Colors';
import ProgressImage from './Image/ProgressImage';

// const Image = createImageProgress(FastImage);

export default class LoadingImage extends Component {
  static defaultProps = {
    // priority: FastImage.priority.high,
  };
  setNativeProps = (nativeProps) => {
    this._root.setNativeProps && this._root.setNativeProps(nativeProps);
  };

  render() {
    const {
      source, progress, priority, ...everythingElse
    } = this.props;
    let _source = source;

    if (typeof _source === 'string') {
      _source = { uri: _source, priority };
    }

    // return (null);

    return (
      <ProgressImage
        {...everythingElse}
        indicatorProps={{
          indeterminate: progress == null,
          progress: progress || 1,
          color: Colors.tintColor,
        }}
        ref={component => (this._root = component)}
        source={_source}
      />
    );
  }
}
