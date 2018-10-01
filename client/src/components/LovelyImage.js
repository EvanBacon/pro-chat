// import React, { Component } from 'react';
// import {
//   StyleSheet,
//   View,
//   Easing,
//   Animated,
//   // Image,
//   Text
// } from 'react-native';
// import Colors from '../constants/Colors';
// import { Lovely } from './index'
// import Image from 'react-native-image-progress';
// import ProgressBar from 'react-native-progress/Bar';

// export default class LovelyImage extends Component {
//   state = { loading: false }
//   componentDidMount() {
//     this.setState({ loading: true })
//   }
//   componentWillUnmount() {
//     this.setState({ loading: false })
//     // clearInterval(this._timer);
//   }

//   render() {
//     const { source, ...everythingElse } = this.props
//     let _source = source || require('../assets/images/splash_icon.png')

//     if (typeof _source === 'string') {
//       _source = { uri: _source }
//     }

//     return (
//       <Image
//         {...everythingElse}
//         source={_source}
//         indicator={ProgressBar}
//         style={[{ justifyContent: 'center', alignItems: 'center' }, this.props.style]}
//       />
//     )
//     // return (
//     //   <Image
//     //     {...everythingElse}
//     //     source={_source}
//     //     style={[{justifyContent: 'center', alignItems: 'center'}, this.props.style]}
//     //     onLoad={_=> {
//     //       this.setState({loading: true})
//     //     }}
//     //     onLoadEnd={_=> {
//     //       this.setState({loading: false})
//     //     }}>
//     //     {this.state.loading && <Lovely size={(this.props.size - 20) || 150} />}
//     //   </Image>
//     // );
//   }
// }

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   textStyle: {
//     // fontFamily: 'montserrat-bold',
//     color: 'black',
//     fontSize: 25
//   },
//   loader: { height: 75 }
// });
