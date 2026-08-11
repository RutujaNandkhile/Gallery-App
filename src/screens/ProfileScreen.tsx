import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { validateProfileForm } from '@/utils/validation';
import { AVATARS, CITIES, Gender } from '@/types';

const GENDERS: Gender[] = ['Male', 'Female', 'Other'];
const AVATAR_EMOJI: Record<string, string> = {
  avatar1: '🦊',
  avatar2: '🐼',
  avatar3: '🐯',
  avatar4: '🦁',
  avatar5: '🐨',
  avatar6: '🐸',
};

export function ProfileScreen() {
  const { colors, mode, toggleTheme } = useTheme();
  const { user, updateProfile, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [city, setCity] = useState(user?.city ?? CITIES[0]);
  const [gender, setGender] = useState<Gender>(user?.gender ?? 'Male');
  const [avatarId, setAvatarId] = useState(user?.avatarId ?? AVATARS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const resetForm = () => {
    setFullName(user.fullName);
    setMobileNumber(user.mobileNumber);
    setAddress(user.address);
    setCity(user.city);
    setGender(user.gender);
    setAvatarId(user.avatarId ?? AVATARS[0]);
    setErrors({});
  };

  const handleSave = async () => {
    const result = validateProfileForm({ fullName, mobileNumber, address, city });
    setErrors(result.errors);
    if (!result.valid) return;

    setSaving(true);
    try {
      const outcome = await updateProfile({ fullName, mobileNumber, address, city, gender, avatarId });
      if (outcome.success) {
        setEditing(false);
      } else {
        Alert.alert('Update failed', outcome.error ?? 'Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.chipBackground }]}>
          <Text style={{ fontSize: 44 }}>{AVATAR_EMOJI[avatarId] ?? '🙂'}</Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{user.fullName}</Text>
        <Text style={[styles.email, { color: colors.subtext }]}>{user.email}</Text>
      </View>

      {editing && (
        <View style={styles.avatarPicker}>
          <Text style={[styles.sectionLabel, { color: colors.subtext }]}>Choose Avatar</Text>
          <View style={styles.avatarRow}>
            {AVATARS.map((id) => (
              <Pressable
                key={id}
                onPress={() => setAvatarId(id)}
                style={[
                  styles.avatarOption,
                  {
                    backgroundColor: colors.chipBackground,
                    borderColor: avatarId === id ? colors.primary : 'transparent',
                  },
                ]}
              >
                <Text style={{ fontSize: 26 }}>{AVATAR_EMOJI[id]}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {editing ? (
          <>
            <FormInput label="Full Name" value={fullName} onChangeText={setFullName} error={errors.fullName} />
            <FormInput
              label="Mobile Number"
              value={mobileNumber}
              onChangeText={(t) => setMobileNumber(t.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              maxLength={10}
              error={errors.mobileNumber}
            />
            <FormInput label="Address" value={address} onChangeText={setAddress} error={errors.address} multiline />

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.subtext }]}>City</Text>
              <View style={[styles.pickerWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Picker selectedValue={city} onValueChange={setCity} style={{ color: colors.text }}>
                  {CITIES.map((c) => (
                    <Picker.Item key={c} label={c} value={c} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.subtext }]}>Gender</Text>
              <View style={styles.radioRow}>
                {GENDERS.map((g) => (
                  <Pressable key={g} style={styles.radioOption} onPress={() => setGender(g)}>
                    <View
                      style={[styles.radioOuter, { borderColor: gender === g ? colors.primary : colors.border }]}
                    >
                      {gender === g && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                    </View>
                    <Text style={{ color: colors.text }}>{g}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.editActions}>
              <PrimaryButton
                title="Cancel"
                variant="outline"
                onPress={() => {
                  resetForm();
                  setEditing(false);
                }}
                style={{ flex: 1, marginRight: 8 }}
              />
              <PrimaryButton title="Save" onPress={handleSave} loading={saving} style={{ flex: 1, marginLeft: 8 }} />
            </View>
          </>
        ) : (
          <>
            <InfoRow label="Mobile Number" value={user.mobileNumber} colors={colors} />
            <InfoRow label="Gender" value={user.gender} colors={colors} />
            <InfoRow label="Address" value={user.address} colors={colors} />
            <InfoRow label="City" value={user.city} colors={colors} />

            <PrimaryButton title="Edit Profile" onPress={() => setEditing(true)} style={{ marginTop: 12 }} />
          </>
        )}
      </View>

      <View style={[styles.card, styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
          <Switch value={mode === 'dark'} onValueChange={toggleTheme} trackColor={{ true: colors.primary }} />
        </View>
      </View>

      <PrimaryButton
        title="Logout"
        variant="outline"
        onPress={handleLogout}
        style={{ marginTop: 20, borderColor: colors.danger }}
      />
    </ScrollView>
  );
}

function InfoRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.subtext }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 20, fontWeight: '800', marginTop: 12 },
  email: { fontSize: 13, marginTop: 2 },
  avatarPicker: { marginBottom: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  avatarRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  avatarOption: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 16 },
  settingsCard: { paddingVertical: 12 },
  infoRow: { marginBottom: 14 },
  infoLabel: { fontSize: 12, fontWeight: '600', marginBottom: 3 },
  infoValue: { fontSize: 15, fontWeight: '600' },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  pickerWrapper: { borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
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
  editActions: { flexDirection: 'row', marginTop: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
