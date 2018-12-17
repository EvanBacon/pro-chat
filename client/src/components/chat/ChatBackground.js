//
// Copyright (c) 2017-present, by Evan Bacon. All Rights Reserved.
// @author Evan Bacon / https://github.com/EvanBacon
//
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import MetaData from '../../constants/Meta';
import Circle from '../primitives/Circle';
import LoadingImage from '../Image/ProgressImage';
import Meta from '../Meta';
import styles from '../styles';
import AvatarImage from '../Image/AvatarImage';

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
            <Circle
              style={StyleSheet.flatten([
                { width: '60%', backgroundColor: 'white' },
                styles.border,
                styles.shadow,
              ])}
            >
              <AvatarImage
                name={name}
                avatar={image}
                textStyle={{ fontSize: 64 }}
                avatarStyle={{
                  aspectRatio: 1,
                  resizeMode: 'cover',
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  borderRadius: 0,
                }}
              />
            </Circle>
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
