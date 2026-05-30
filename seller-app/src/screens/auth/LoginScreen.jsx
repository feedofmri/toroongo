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

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      const data = err.response?.data;
      // Network error — no response received
      if (!err.response) {
        Alert.alert('Connection Error', 'Cannot reach the server. Make sure the backend is running.');
        return;
      }
      // Laravel ValidationException puts the message inside errors.email[0]
      const msg =
        data?.errors?.email?.[0] ??
        data?.errors?.password?.[0] ??
        data?.message ??
        'Login failed. Check your credentials.';
      Alert.alert('Login Failed', msg);
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
            <Text style={styles.tagline}>Seller Portal</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to manage your store</Text>

            <Input
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
              secureTextEntry={!showPassword}
              error={errors.password}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                  <Text style={styles.toggle}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              }
            />

            <Button title="Sign In" onPress={handleLogin} loading={loading} fullWidth style={styles.btn} />

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerRow}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <Text style={styles.registerLink}>Create one free</Text>
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
  btn: { marginTop: Spacing.sm },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: Colors.borderSoft },
  orText: { marginHorizontal: Spacing.sm, color: Colors.textMuted, fontSize: FontSize.sm },

  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { fontSize: FontSize.sm, color: Colors.textMuted },
  registerLink: { fontSize: FontSize.sm, color: Colors.primary, fontFamily: FontFamily.semibold },
});
