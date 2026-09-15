import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useProduct } from '../context/ProductContext';
import { ProductCategory } from '../types/shop';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { ErrorState } from '../components/ErrorState';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'EditProduct'>;

const AVAILABLE_CATEGORIES: ProductCategory[] = [
  'Curry Cut',
  'Boneless',
  'Specialty',
  'Whole Chicken',
];

export function EditProductScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { productId } = route.params;
  const { getProductById, updateProduct, deleteProduct } = useProduct();

  const product = getProductById(productId);

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Curry Cut');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [pieces, setPieces] = useState('');
  const [serves, setServes] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setTagline(product.tagline || '');
      setCategory(product.category);
      setPrice(product.price.toString());
      setWeight(product.weight);
      setPieces(product.pieces || '');
      setServes(product.serves || '');
      setCookingTime(product.cookingTime || '');
      setDescription(product.description);
      setIsAvailable(product.isAvailable);
    }
  }, [product]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Header title="Edit Product" showBack onBack={() => navigation.goBack()} />
        <ErrorState
          title="Product Not Found"
          message={`No product found with ID ${productId}.`}
          retryTitle="Back to Catalog"
          onRetry={() => navigation.goBack()}
        />
      </View>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Product name is required';
    if (!price.trim()) {
      errs.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      errs.price = 'Enter a valid positive price in ₹';
    }
    if (!weight.trim()) errs.weight = 'Weight/Unit is required';
    if (!description.trim()) errs.description = 'Description is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = () => {
    if (!validate()) return;

    setLoading(true);
    try {
      updateProduct(productId, {
        name: name.trim(),
        tagline: tagline.trim(),
        category,
        price: parseFloat(price),
        weight: weight.trim(),
        pieces: pieces.trim(),
        serves: serves.trim(),
        cookingTime: cookingTime.trim(),
        description: description.trim(),
        isAvailable,
      });

      Alert.alert('Changes Saved', `"${name}" details have been updated.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to permanently delete "${name}" from your store catalog?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProduct(productId);
            Alert.alert('Deleted', `"${name}" removed from catalog.`);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Edit Chicken Cut"
        subtitle={`Item ID: ${productId}`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <AppText variant="captionBold" color={COLORS.textMuted} style={styles.cardHeader}>
            BASIC DETAILS
          </AppText>

          <AppInput
            label="Product Name"
            value={name}
            onChangeText={text => {
              setName(text);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            error={errors.name}
            required
          />

          <AppInput label="Short Tagline" value={tagline} onChangeText={setTagline} />

          {/* Category Selector */}
          <View style={styles.fieldGroup}>
            <AppText variant="captionBold" color={COLORS.textSecondary} style={styles.fieldLabel}>
              Category{' '}
              <AppText variant="captionBold" color={COLORS.error}>
                *
              </AppText>
            </AppText>
            <View style={styles.categoryPillsRow}>
              {AVAILABLE_CATEGORIES.map(cat => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    activeOpacity={0.8}
                    onPress={() => setCategory(cat)}
                    style={[styles.catBtn, isSelected && styles.catBtnActive]}
                  >
                    <AppText
                      variant="captionBold"
                      color={isSelected ? COLORS.white : COLORS.textSecondary}
                    >
                      {cat}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <AppText variant="captionBold" color={COLORS.textMuted} style={styles.cardHeader}>
            PRICING & PORTION
          </AppText>

          <View style={styles.rowTwo}>
            <View style={styles.halfCol}>
              <AppInput
                label="Price (₹)"
                prefix="₹"
                keyboardType="numeric"
                value={price}
                onChangeText={text => {
                  setPrice(text);
                  if (errors.price) setErrors(prev => ({ ...prev, price: '' }));
                }}
                error={errors.price}
                required
              />
            </View>

            <View style={styles.halfCol}>
              <AppInput
                label="Weight / Unit"
                value={weight}
                onChangeText={text => {
                  setWeight(text);
                  if (errors.weight) setErrors(prev => ({ ...prev, weight: '' }));
                }}
                error={errors.weight}
                required
              />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={styles.halfCol}>
              <AppInput label="Pieces Count" value={pieces} onChangeText={setPieces} />
            </View>

            <View style={styles.halfCol}>
              <AppInput label="Serves" value={serves} onChangeText={setServes} />
            </View>
          </View>

          <AppInput
            label="Estimated Cooking Time"
            value={cookingTime}
            onChangeText={setCookingTime}
          />
        </View>

        <View style={styles.card}>
          <AppText variant="captionBold" color={COLORS.textMuted} style={styles.cardHeader}>
            DESCRIPTION & AVAILABILITY
          </AppText>

          <AppInput
            label="Product Description"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={text => {
              setDescription(text);
              if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
            }}
            error={errors.description}
            required
          />

          <View style={styles.availabilityRow}>
            <View>
              <AppText variant="bodyBold" color={COLORS.text}>
                In Stock & Ordering Status
              </AppText>
              <AppText variant="caption" color={COLORS.textMuted}>
                {isAvailable
                  ? 'In Stock (Live for ordering)'
                  : 'Out of Stock (Hidden from ordering)'}
              </AppText>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: '#CBD5E1', true: '#A7F3D0' }}
              thumbColor={isAvailable ? COLORS.success : '#F1F5F9'}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonStack}>
          <AppButton
            title="Save Changes ✓"
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleUpdate}
          />

          <AppButton
            title="Delete Product 🗑"
            variant="outline"
            size="md"
            onPress={handleDelete}
            style={styles.deleteBtn}
            textStyle={{ color: COLORS.error }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardHeader: {
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  fieldGroup: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    marginBottom: SPACING.xs,
  },
  categoryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs + 2,
  },
  catBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rowTwo: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfCol: {
    flex: 1,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginTop: SPACING.xs,
  },
  buttonStack: {
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  deleteBtn: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.surface,
  },
});
