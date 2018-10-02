import React from 'react';
import { TouchableHighlight, Text, View } from 'react-native';

import Colors from '../../constants/Colors';

export default (Button = ({
  style, onPress, color, title, on, disabled,
}) => (
  <TouchableHighlight
    disabled={disabled}
    style={[{ minHeight: 40, maxHeight: 40 }, style]}
    onPress={onPress}
    underlayColor={Colors.lightUnderlay}
  >
    <View
      style={{
        flex: 1,
        borderWidth: 2,
        borderColor: color || Colors.white,
        backgroundColor: on ? Colors.white : Colors.transparent,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        style={{
          overflow: 'hidden',

          textAlign: 'center',
          fontSize: 12,
          paddingVertical: 10,
          paddingHorizontal: 20,
          color: color || (on ? Colors.tintColor : Colors.white),
        }}
      >
        {(title || '').toUpperCase()}
      </Text>
    </View>
  </TouchableHighlight>
));
