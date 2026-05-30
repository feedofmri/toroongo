import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';

export default function Input({ label, error, containerStyle, rightIcon, leftIcon, style, ...rest }) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, focused && styles.focused, error && styles.errorBorder]}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithLeft, rightIcon && styles.inputWithRight, style]}
          placeholderTextColor={Colors.textLight}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.base },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Poppins_500Medium',
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderSoft,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
  },
  focused: { borderColor: Colors.primary },
  errorBorder: { borderColor: Colors.danger },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  inputWithLeft: { paddingLeft: Spacing.xs },
  inputWithRight: { paddingRight: Spacing.xs },
  icon: { paddingLeft: Spacing.md },
  iconRight: { paddingRight: Spacing.md },
  error: { fontSize: FontSize.xs, color: Colors.danger, marginTop: 4 },
});
