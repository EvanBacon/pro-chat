//
// Copyright (c) 2017-present, by Evan Bacon. All Rights Reserved.
// @author Evan Bacon / https://github.com/EvanBacon
//
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import MetaData from '../../constants/Meta';
import Circle from '../Circle';
import LoadingImage from '../Image/ProgressImage';
import Meta from '../Meta';
import styles from '../styles';

export default class EmptyChat extends React.PureComponent {
  render() {
    const { image, timestamp, name } = this.props;

    // const buttonAnimate = (delay, view) => (
    //   <Animatable.View
    //     delay={600 + delay}
    //     style={{ marginBottom: 8 }}
    //     easing="ease-out"
    //     animation="fadeInUp"
    //     useNativeDriver
    //   >
    //     {view}
    //   </Animatable.View>
    // );

    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
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
        {image && (
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
              <LoadingImage style={{ flex: 1 }} source={image} />
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
