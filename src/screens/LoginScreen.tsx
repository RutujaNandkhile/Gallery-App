import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { validateLoginForm } from '@/utils/validation';
import { AuthStackParamList } from '@/navigation/types';

export function LoginScreen() {
  const { colors } = useTheme();
  const { login } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const result = validateLoginForm({ email, password });
    setErrors(result.errors);
    if (!result.valid) return;

    setSubmitting(true);
    try {
      const outcome = await login(email, password);
      if (!outcome.success) {
        Alert.alert('Login failed', outcome.error ?? 'Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={[styles.heading, { color: colors.text }]}>Welcome Back</Text>
        <Text style={[styles.subheading, { color: colors.subtext }]}>Sign in to continue browsing images</Text>

        <FormInput
          label="Email Address"
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <FormInput
          label="Password"
          placeholder="Your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />

        <PrimaryButton title="Login" onPress={handleSubmit} loading={submitting} style={{ marginTop: 8 }} />

        <Pressable style={styles.footer} onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: colors.subtext }}>
            Don&apos;t have an account? <Text style={{ color: colors.primary, fontWeight: '700' }}>Register</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  heading: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  subheading: { fontSize: 14, marginBottom: 24 },
  footer: { marginTop: 20, alignItems: 'center' },
});
