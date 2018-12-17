//
// Copyright (c) 2017-present, by Evan Bacon. All Rights Reserved.
// @author Evan Bacon / https://github.com/EvanBacon
//
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import MetaData from '../../constants/Meta';
import ProfileImage from '../Image/ProfileImage';
import Meta from '../Meta';

export default class EmptyChat extends React.PureComponent {
  render() {
    const { image, timestamp, name } = this.props;

    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'center',
          height: '100%',
          alignItems: 'center',
          flex: 1,
        }}
      >
        {timestamp && (
          <Text
            style={{
              color: 'black',
              fontSize: 24,
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            You Matched {timestamp}
          </Text>
        )}
        {(image || name) && (
          <Animatable.View
            useNativeDriver
            duration={1200}
            delay={10}
            easing="ease-out-back"
            animation="zoomIn"
          >
            <ProfileImage
              name={name}
              image={image}
              size={Dimensions.get('window').width * 0.6}
              lightbox={true}
              isUser={false}
            />
          </Animatable.View>
        )}
        <Animatable.View
          useNativeDriver
          animation="zoomIn"
          style={{ marginTop: 24 }}
        >
          <Meta
            color="black"
            title={`${MetaData.empty_message_title} ${name}`}
            subtitle={`${MetaData.empty_message_question} ${name} ${
              MetaData.empty_message_adjective
            }`}
          />
        </Animatable.View>
      </View>
    );
  }
}
