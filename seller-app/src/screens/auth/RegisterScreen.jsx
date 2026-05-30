import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius } from '../../constants/theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.password_confirmation) errs.password_confirmation = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        Object.keys(data.errors).forEach((k) => { mapped[k] = data.errors[k][0]; });
        setErrors(mapped);
      } else {
        Alert.alert('Registration Failed', data?.message ?? 'Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>T</Text>
            </View>
            <Text style={styles.brand}>Toroongo</Text>
            <Text style={styles.tagline}>Start selling today — free</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Create your store</Text>
            <Text style={styles.subtitle}>Join thousands of sellers on Toroongo</Text>

            <Input
              label="Full Name"
              placeholder="Your name"
              value={form.name}
              onChangeText={(t) => set('name', t)}
              autoCapitalize="words"
              error={errors.name}
            />
            <Input
              label="Email Address"
              placeholder="you@example.com"
              value={form.email}
              onChangeText={(t) => set('email', t)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <Input
              label="Password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChangeText={(t) => set('password', t)}
              secureTextEntry={!showPassword}
              error={errors.password}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                  <Text style={styles.toggle}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              }
            />
            <Input
              label="Confirm Password"
              placeholder="Repeat password"
              value={form.password_confirmation}
              onChangeText={(t) => set('password_confirmation', t)}
              secureTextEntry={!showPassword}
              error={errors.password_confirmation}
            />

            <Button title="Create Account" onPress={handleRegister} loading={loading} fullWidth style={styles.btn} />

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.base },

  header: { alignItems: 'center', marginBottom: Spacing['2xl'] },
  logoContainer: {
    width: 64, height: 64, borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  logoText: { fontSize: FontSize['3xl'], color: Colors.white, fontFamily: FontFamily.bold },
  brand: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.textPrimary },
  tagline: { fontSize: FontSize.base, color: Colors.textMuted, marginTop: 2 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
  },
  title: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 4, marginBottom: Spacing.xl },

  toggle: { fontSize: FontSize.sm, color: Colors.primary, fontFamily: FontFamily.medium },
  btn: { marginTop: Spacing.sm, marginBottom: Spacing.lg },

  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: FontSize.sm, color: Colors.textMuted },
  loginLink: { fontSize: FontSize.sm, color: Colors.primary, fontFamily: FontFamily.semibold },
});
