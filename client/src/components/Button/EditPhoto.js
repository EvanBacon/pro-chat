import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

class EditPhoto extends React.PureComponent {
  render() {
    const { onPress, style, ...props } = this.props;
    return (
      <TouchableOpacity style={style} onPress={onPress}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 36 / 2,
            backgroundColor: 'orange',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MaterialIcons style={{ backgroundColor: 'transparent' }} name="add" color="white" size={24} />
        </View>
      </TouchableOpacity>
    );
  }
}

export default EditPhoto;
