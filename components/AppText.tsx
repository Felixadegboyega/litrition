import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

const AppText = ({ style, ...props }: Readonly<TextProps>) => {
  return (
    <Text {...props} style={[styles.defaultFont, style]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'Inter-Regular',
  },
});

export default AppText;
