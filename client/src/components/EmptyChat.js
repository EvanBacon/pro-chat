//
// Copyright (c) 2017-present, by Evan Bacon. All Rights Reserved.
// @author Evan Bacon / https://github.com/EvanBacon
//
import { dispatch } from '@rematch/core';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import MetaData from '../constants/Meta';
import Circle from './Circle';
import LoadingImage from './LoadingImage';
import Meta from './Meta';
import styles from './styles';

// import { NavigationActions } from 'react-navigation'
export default class EmptyChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null, // "https://www.biography.com/.image/t_share/MTE5NDg0MDU0ODczNDc0NTc1/ben-affleck-9176967-2-402.jpg",
      name: '',
      // imageAnimation: 'zoomIn',
    };
  }

  loadData = ({ uid }) => {
    (async () => {
      try {
        dispatch.users.getPropertyForUser({
          uid,
          property: 'first_name',
          callback: (name) => {
            if (this.mounted) {
              this.setState(state => ({ ...state, name }));
            }
          },
        });
        // const name = await ProfileProvider.getPropertyForUser({
        //   uid,
        //   property: 'first_name',
        // });
        // if (this.mounted) {
        //   this.setState(state => ({ ...state, name }));
        // }
      } catch (error) {
        console.warn(error);
      }
    })();

    (async () => {
      try {
        const timestamp = await dispatch.relationships.whenWasUserRated({ uid });
        if (this.mounted) {
          this.setState(state => ({ ...state, timestamp }));
        }
      } catch (error) {
        console.warn(error);
      }
    })();

    (async () => {
      dispatch.users.getProfileImage({ uid });
      // try {

      //   const image = await
      //   if (this.mounted) {
      //     // console.warn("bingo", image);
      //     this.setState(state => ({ ...state, image }));
      //   }
      // } catch (error) {
      //   console.warn(error);
      // }
    })();
  };

  componentWillMount() {
    this.mounted = true;
    this.loadData(this.props);
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(next) {
    const { uid } = this.props;
    const nUid = next.uid;

    if (uid !== nUid) {
      this.loadData({ uid: nUid });
    }
  }

  render() {
    const { image, timestamp, name } = this.state;

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
          <Animatable.View useNativeDriver duration={1200} delay={10} easing="ease-out-back" animation="zoomIn">
            <Circle
              style={StyleSheet.flatten([{ width: '60%', backgroundColor: 'white' }, styles.border, styles.shadow])}
            >
              <LoadingImage style={{ flex: 1 }} source={image} />
            </Circle>
          </Animatable.View>
        )}
        <Animatable.View useNativeDriver animation="zoomIn" style={{ marginTop: 24 }}>
          <Meta
            color="black"
            title={`${MetaData.empty_message_title} ${name}`}
            subtitle={`${MetaData.empty_message_question} ${name} ${MetaData.empty_message_adjective}`}
          />
        </Animatable.View>
      </View>
    );
  }
}
