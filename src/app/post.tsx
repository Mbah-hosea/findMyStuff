import { useRouter } from 'expo-router';
import { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormField } from '../components/FormField';
import { theme } from '../constants/appTheme';
import { ITEM_CATEGORIES } from '../constants/categories';
import { useItems } from '../context/ItemsContext';
import type { ItemType } from '../types/item';

const today = () => new Date().toISOString().slice(0, 10);

export default function PostScreen() {
  const router = useRouter();
  const { addItem } = useItems();

  const [type, setType] = useState<ItemType>('lost');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(today());
  const [privateDetail, setPrivateDetail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFound = type === 'found';

  const validate = () => {
    const e: Record<string, string> = {};
    if (!category) e.category = 'Please choose a category.';
    if (title.trim().length < 3) e.title = 'Enter a short title.';
    if (!location.trim()) e.location = 'Enter where it was lost or found.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) e.date = 'Use the format YYYY-MM-DD.';
    if (isFound && privateDetail.trim().length < 3) {
      e.privateDetail = 'Add a private detail so the real owner can be verified.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setCategory('');
    setTitle('');
    setDescription('');
    setColor('');
    setLocation('');
    setDate(today());
    setPrivateDetail('');
    setErrors({});
  };

  const handleSubmit = () => {
    if (!validate()) return;

    addItem({
      type,
      category,
      title: title.trim(),
      description: description.trim(),
      color: color.trim(),
      location: location.trim(),
      date,
    });

    resetForm();

    Alert.alert(
      'Posted',
      isFound
        ? 'Your found item has been posted. Its private detail stays hidden.'
        : 'Your lost item has been posted. We will notify you about matches.',
      [{ text: 'OK', onPress: () => router.push('../myposts') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Post an item</Text>

          <View style={styles.toggle}>
            {(['lost', 'found'] as ItemType[]).map((t) => (
              <Pressable
                key={t}
                style={[styles.toggleBtn, type === t && styles.toggleActive]}
                onPress={() => setType(t)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    type === t && styles.toggleTextActive,
                  ]}
                >
                  {t === 'lost' ? 'I lost something' : 'I found something'}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.chips}>
            {ITEM_CATEGORIES.map((c) => (
              <Pressable
                key={c}
                style={[styles.chip, category === c && styles.chipActive]}
                onPress={() => setCategory(c)}
              >
                <Text
                  style={[styles.chipText, category === c && styles.chipTextActive]}
                >
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>
          {errors.category ? (
            <Text style={styles.error}>{errors.category}</Text>
          ) : null}

          <FormField
            label="Title"
            placeholder="e.g. Black Samsung phone"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />
          <FormField
            label="Description"
            placeholder="Any visible details that can help"
            value={description}
            onChangeText={setDescription}
            multiline
            style={{ minHeight: 90, textAlignVertical: 'top' }}
          />
          <FormField
            label="Color"
            placeholder="e.g. Black"
            value={color}
            onChangeText={setColor}
          />
          <FormField
            label={isFound ? 'Where did you find it?' : 'Where did you lose it?'}
            placeholder="e.g. Library"
            value={location}
            onChangeText={setLocation}
            error={errors.location}
          />
          <FormField
            label="Date"
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
            error={errors.date}
          />

          {isFound ? (
            <View style={styles.privateBox}>
              <Text style={styles.privateTitle}>Private detail (hidden)</Text>
              <Text style={styles.privateHint}>
                Never shown publicly. Owners must describe it correctly to claim
                the item, e.g. a sticker, the phone wallpaper, or what is inside
                the bag.
              </Text>
              <FormField
                label="Private detail"
                placeholder="Something only the owner would know"
                value={privateDetail}
                onChangeText={setPrivateDetail}
                error={errors.privateDetail}
              />
            </View>
          ) : null}

          <Pressable style={styles.submit} onPress={handleSubmit}>
            <Text style={styles.submitText}>Post item</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 40 },
  heading: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  toggleActive: { backgroundColor: theme.colors.primary },
  toggleText: { color: theme.colors.textMuted, fontWeight: '600' },
  toggleTextActive: { color: '#FFFFFF' },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  chipText: { color: theme.colors.textMuted },
  chipTextActive: { color: theme.colors.primary, fontWeight: '600' },
  error: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.md,
  },
  privateBox: {
    backgroundColor: theme.colors.foundBg,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  privateTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.found,
  },
  privateHint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginVertical: theme.spacing.sm,
  },
  submit: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  submitText: { color: '#FFFFFF', fontSize: theme.fontSize.lg, fontWeight: '700' },
});