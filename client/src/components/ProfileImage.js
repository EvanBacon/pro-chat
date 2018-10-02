// import React from 'react';
// import { Dimensions, StyleSheet, View } from 'react-native';
// import * as Animatable from 'react-native-animatable';
// import { Pie } from 'react-native-progress/Pie';

// import Colors from '../constants/Colors';
// import Images from '../Images';
// import Button from './Button';
// import Circle from './Circle';
// import Lightbox from './Lightbox';
// import LoadingImage from './LoadingImage';

// const { width } = Dimensions.get('window');

// export default class ProfileImage extends React.Component {
//   state = {
//     progress: null,
//   };
//   onImage = async (image) => {
//     if (image) {
//       try {
//         await ImageProvider.uploadProfileImage(image, progress =>
//           this.setState({ progress }));
//         this.props.onImageUpdated && this.props.onImageUpdated();
//       } catch (error) {
//         // TODO: Handle Image upload failure
//       }
//     }
//   };
//   renderImage = (image) => {
//     if (this.props.lightbox) {
//       return (
//         <Lightbox
//           onOpen={() => this.setState({ isOpen: true })}
//           onClose={() => this.setState({ isOpen: false })}
//           activeProps={{
//             style: [{ resizeMode: 'contain', flex: 1 }],
//           }}
//           borderRadius={width - 110 / 2}
//           style={{}}
//         >
//           {image}
//         </Lightbox>
//       );
//     }
//     return image;
//   };
//   render() {
//     const {
//       source, isUser, isEditing, onEditingChanged,
//     } = this.props;
//     return (
//       <View
//         style={{
//           width: width - 110,
//           aspectRatio: 1,
//         }}
//       >
//         <Circle
//           style={[
//             {
//               flex: 1,
//               borderWidth: StyleSheet.hairlineWidth,
//               borderColor: '#F9F9F9',
//               backgroundColor: 'white',
//             },
//             StyleSheet.absoluteFill,
//           ]}
//         >
//           {this.renderImage(<LoadingImage
//             source={source}
//             style={[
//                 {
//                   width: width - 110,
//                   borderRadius: (width - 110) / 2,
//                   overflow: 'hidden',
//                   aspectRatio: 1,
//                 },
//               ]}
//           />)}
//         </Circle>
//         {this.state.progress &&
//           this.state.progress != 1 && (
//             <View
//               style={[
//                 StyleSheet.absoluteFill,
//                 { justifyContent: 'center', alignItems: 'center' },
//               ]}
//             >
//               <Pie
//                 color={Colors.tintColor}
//                 progress={this.state.progress}
//                 size={80}
//               />
//             </View>
//           )}
//         {isUser &&
//           !this.state.isOpen && (
//             <Animatable.View
//               duration={900}
//               easing="ease-out-back"
//               animation="zoomIn"
//               useNativeDriver
//               style={{ position: 'absolute', top: 0, left: 0 }}
//             >
//               <Button.Edit
//                 icon={isEditing ? Images.close : Images.pencil}
//                 onPress={onEditingChanged}
//                 tint={Colors.tintColor}
//               />
//             </Animatable.View>
//           )}
//       </View>
//     );
//   }
// }


import ProfileImage from './Image/ProfileImage';
export default ProfileImage;
