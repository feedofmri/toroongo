import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontSize, Radius, Spacing } from '../../constants/theme';

export default function Badge({ label, color = '#008080', bgColor, style }) {
  const bg = bgColor ?? `${color}18`;
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSize.xs,
    fontFamily: 'Poppins_600SemiBold',
    textTransform: 'capitalize',
  },
});
