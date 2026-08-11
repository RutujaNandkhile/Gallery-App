import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { validateRegisterForm } from '@/utils/validation';
import { CITIES, Gender, RegisterFormValues } from '@/types';
import { AuthStackParamList } from '@/navigation/types';

const GENDERS: Gender[] = ['Male', 'Female', 'Other'];

const INITIAL_VALUES: RegisterFormValues = {
  fullName: '',
  email: '',
  gender: 'Male',
  mobileNumber: '',
  address: '',
  city: CITIES[0],
  password: '',
  confirmPassword: '',
};

export function RegisterScreen() {
  const { colors } = useTheme();
  const { register } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof RegisterFormValues>(key: K, value: RegisterFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const result = validateRegisterForm(values);
    setErrors(result.errors);
    if (!result.valid) return;

    setSubmitting(true);
    try {
      const outcome = await register(values);
      if (!outcome.success) {
        Alert.alert('Registration failed', outcome.error ?? 'Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.heading, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.subheading, { color: colors.subtext }]}>
          Fill in your details to get started
        </Text>

        <FormInput
          label="Full Name"
          placeholder="John Doe"
          value={values.fullName}
          onChangeText={(t) => setField('fullName', t)}
          error={errors.fullName}
        />
        <FormInput
          label="Email Address"
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={values.email}
          onChangeText={(t) => setField('email', t)}
          error={errors.email}
        />

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.subtext }]}>Gender</Text>
          <View style={styles.radioRow}>
            {GENDERS.map((g) => (
              <Pressable key={g} style={styles.radioOption} onPress={() => setField('gender', g)}>
                <View
                  style={[
                    styles.radioOuter,
                    { borderColor: values.gender === g ? colors.primary : colors.border },
                  ]}
                >
                  {values.gender === g && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={{ color: colors.text }}>{g}</Text>
              </Pressable>
            ))}
          </View>
          {!!errors.gender && <Text style={[styles.error, { color: colors.danger }]}>{errors.gender}</Text>}
        </View>

        <FormInput
          label="Mobile Number"
          placeholder="10-digit mobile number"
          keyboardType="number-pad"
          maxLength={10}
          value={values.mobileNumber}
          onChangeText={(t) => setField('mobileNumber', t.replace(/[^0-9]/g, ''))}
          error={errors.mobileNumber}
        />
        <FormInput
          label="Address"
          placeholder="Street, area"
          value={values.address}
          onChangeText={(t) => setField('address', t)}
          error={errors.address}
          multiline
        />

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.subtext }]}>City</Text>
          <View style={[styles.pickerWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Picker
              selectedValue={values.city}
              onValueChange={(v) => setField('city', v)}
              dropdownIconColor={colors.text}
              style={{ color: colors.text }}
            >
              {CITIES.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
          {!!errors.city && <Text style={[styles.error, { color: colors.danger }]}>{errors.city}</Text>}
        </View>

        <FormInput
          label="Password"
          placeholder="At least 6 characters"
          secureTextEntry
          value={values.password}
          onChangeText={(t) => setField('password', t)}
          error={errors.password}
        />
        <FormInput
          label="Confirm Password"
          placeholder="Re-enter password"
          secureTextEntry
          value={values.confirmPassword}
          onChangeText={(t) => setField('confirmPassword', t)}
          error={errors.confirmPassword}
        />

        <PrimaryButton title="Register" onPress={handleSubmit} loading={submitting} style={{ marginTop: 8 }} />

        <Pressable style={styles.footer} onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: colors.subtext }}>
            Already have an account? <Text style={{ color: colors.primary, fontWeight: '700' }}>Sign in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 26, fontWeight: '800', marginBottom: 4 },
  subheading: { fontSize: 14, marginBottom: 20 },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  radioRow: { flexDirection: 'row', gap: 20 },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  pickerWrapper: { borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
  error: { fontSize: 12, marginTop: 4 },
  footer: { marginTop: 20, alignItems: 'center' },
});
