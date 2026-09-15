import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>WeMeat Customer</Text>
      <Text style={styles.subtitle}>React Native CLI + React Navigation Ready</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Package: com.wemeat.customer</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  badgeText: {
    color: COLORS.primaryDark,
    fontWeight: '600',
    fontSize: 13,
  },
});
