import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAddress } from '../context/AddressContext';
import { Address, AddressLabel } from '../types/customer';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddressSelection'>;

export const AddressSelectionScreen: React.FC<Props> = ({ route, navigation }) => {
  const fromCheckout = route.params?.fromCheckout ?? true;
  const { addresses, selectedAddress, selectAddress, addAddress, deleteAddress } = useAddress();

  const [showAddModal, setShowAddModal] = useState(false);
  const [label, setLabel] = useState<AddressLabel>('Home');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [formError, setFormError] = useState<string | undefined>();

  const handleSaveAddress = () => {
    if (!name.trim() || !phone.trim() || !addressLine.trim() || !postalCode.trim()) {
      setFormError('Please fill all required fields');
      return;
    }

    addAddress({
      label,
      name,
      phone,
      addressLine,
      landmark,
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode,
      isDefault: false,
    });

    setShowAddModal(false);
    // Reset form
    setName('');
    setPhone('');
    setAddressLine('');
    setLandmark('');
    setPostalCode('');
    setFormError(undefined);
  };

  const handleProceed = () => {
    if (fromCheckout) {
      navigation.navigate('OrderSummary');
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScreenContainer
      scrollable
      backgroundColor={COLORS.background}
      header={
        <Header title="Select Delivery Address" showBack onBackPress={() => navigation.goBack()} />
      }
      footer={
        selectedAddress && (
          <View style={styles.footerBar}>
            <AppButton
              title={fromCheckout ? 'Deliver to this Address →' : 'Confirm Selection'}
              variant="primary"
              size="lg"
              onPress={handleProceed}
              style={styles.confirmBtn}
            />
          </View>
        )
      }
      style={styles.container}
    >
      {/* 1. Add New Address Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowAddModal(true)}
        style={styles.addAddressCard}
      >
        <View style={styles.addIconCircle}>
          <AppText variant="title" color={COLORS.primary}>
            +
          </AppText>
        </View>
        <View>
          <AppText variant="bodyBold" color={COLORS.primary}>
            Add New Delivery Address
          </AppText>
          <AppText variant="caption" color={COLORS.textSecondary}>
            House / Flat, Landmark & Pincode
          </AppText>
        </View>
      </TouchableOpacity>

      {/* 2. Saved Addresses List */}
      <View style={styles.listSection}>
        <AppText variant="title" style={styles.listHeader}>
          Saved Addresses ({addresses.length})
        </AppText>

        {addresses.map(item => {
          const isSelected = selectedAddress?.id === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => selectAddress(item.id)}
              style={[styles.addressCard, isSelected && styles.addressCardSelected]}
            >
              <View style={styles.radioRow}>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>

                <View style={styles.addressInfo}>
                  <View style={styles.labelRow}>
                    <View style={styles.tagBadge}>
                      <AppText variant="captionBold" color={COLORS.primary}>
                        {item.label === 'Home'
                          ? '🏠 Home'
                          : item.label === 'Work'
                            ? '🏢 Work'
                            : '📍 Other'}
                      </AppText>
                    </View>
                    {item.isDefault && (
                      <AppText variant="caption" color={COLORS.textMuted}>
                        (Default)
                      </AppText>
                    )}
                  </View>

                  <AppText variant="bodyBold" style={styles.nameText}>
                    {item.name} • {item.phone}
                  </AppText>

                  <AppText variant="body" color={COLORS.textSecondary} style={styles.lineText}>
                    {item.addressLine}
                  </AppText>

                  {item.landmark && (
                    <AppText variant="caption" color={COLORS.textMuted}>
                      Landmark: {item.landmark}
                    </AppText>
                  )}

                  <AppText variant="caption" color={COLORS.textMuted} style={styles.cityText}>
                    {item.city}, {item.state} - {item.postalCode}
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Add Address Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <AppText variant="h3">Add New Address</AppText>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <AppText variant="h3" color={COLORS.textMuted}>
                  ✕
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Label Pills */}
            <View style={styles.modalLabelRow}>
              {(['Home', 'Work', 'Other'] as AddressLabel[]).map(lbl => (
                <TouchableOpacity
                  key={lbl}
                  activeOpacity={0.8}
                  onPress={() => setLabel(lbl)}
                  style={[styles.modalLabelPill, label === lbl && styles.modalLabelPillActive]}
                >
                  <AppText variant="captionBold" color={label === lbl ? '#FFFFFF' : COLORS.text}>
                    {lbl}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>

            {formError && (
              <AppText
                variant="captionBold"
                color={COLORS.error}
                style={{ marginBottom: SPACING.sm }}
              >
                {formError}
              </AppText>
            )}

            <AppInput
              label="Contact Name *"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChangeText={setName}
            />

            <AppInput
              label="Mobile Number *"
              placeholder="10-digit phone"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <AppInput
              label="House / Flat / Street Address *"
              placeholder="Flat 402, Green Residency..."
              value={addressLine}
              onChangeText={setAddressLine}
            />

            <AppInput
              label="Landmark (Optional)"
              placeholder="Near Metro / Park"
              value={landmark}
              onChangeText={setLandmark}
            />

            <AppInput
              label="Pin Code *"
              placeholder="e.g. 560103"
              keyboardType="numeric"
              maxLength={6}
              value={postalCode}
              onChangeText={setPostalCode}
            />

            <AppButton
              title="Save & Select Address"
              variant="primary"
              size="lg"
              onPress={handleSaveAddress}
              style={{ marginTop: SPACING.sm }}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  addAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    borderStyle: 'dashed',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  addIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listSection: {
    marginBottom: SPACING.xxl,
  },
  listHeader: {
    marginBottom: SPACING.sm,
  },
  addressCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  addressCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F6',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  addressInfo: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  tagBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  nameText: {
    marginBottom: 2,
  },
  lineText: {
    lineHeight: 20,
    marginBottom: 2,
  },
  cityText: {
    marginTop: 2,
  },
  footerBar: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.md,
  },
  confirmBtn: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  modalLabelRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  modalLabelPill: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalLabelPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});
