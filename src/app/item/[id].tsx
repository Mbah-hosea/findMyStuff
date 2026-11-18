import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { FormField } from '../../components/FormField';
import { theme } from '../../constants/appTheme';
import { useItems } from '../../context/ItemsContext';
import { fakeClaims, HANDOVER_POINT } from '../../data/fakeClaims';

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { items, myItemIds } = useItems();
  const [showForm, setShowForm] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>This item could not be found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isFound = item.type === 'found';
  const isMine = myItemIds.includes(item.id);
  const claimCount = fakeClaims.filter((c) => c.itemId === item.id).length;
  const { colors } = theme;

  const handleSubmit = () => {
    if (answer.trim().length < 3) {
      setError(
        isFound
          ? 'Describe the hidden detail so the finder can verify you.'
          : 'Tell the owner where and when you found it.'
      );
      return;
    }

    // Later (Step 8) this will be saved to Supabase as a claim.
    console.log({ itemId: item.id, answer });

    Alert.alert(
      'Sent',
      isFound
        ? 'Your claim was sent. The finder will review your answer.'
        : 'Your message was sent to the owner.'
    );
    setAnswer('');
    setError('');
    setShowForm(false);
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
          <Pressable style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View
            style={[
              styles.badge,
              { backgroundColor: isFound ? colors.foundBg : colors.lostBg },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: isFound ? colors.found : colors.lost },
              ]}
            >
              {isFound ? 'Found' : 'Lost'}
            </Text>
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.infoBox}>
            <InfoRow label="Category" value={item.category} />
            <InfoRow label="Color" value={item.color || '-'} />
            <InfoRow label={isFound ? 'Found at' : 'Lost at'} value={item.location} />
            <InfoRow label="Date" value={item.date} />
            <InfoRow label="Status" value={item.status} />
          </View>

          <View style={styles.handover}>
            <Text style={styles.handoverTitle}>Handover point</Text>
            <Text style={styles.handoverText}>
              {HANDOVER_POINT.name} · {HANDOVER_POINT.hours}
            </Text>
            <Text style={styles.handoverText}>
              Items are only handed over here, never anywhere else.
            </Text>
          </View>

          {isFound && !isMine ? (
            <Text style={styles.note}>
              Some details of this item are hidden by the finder. Only the real
              owner will know them.
            </Text>
          ) : null}

          {isMine ? (
            isFound ? (
              <Pressable
                style={styles.primaryBtn}
                onPress={() =>
                  router.push({
                    pathname: '/claims/[itemId]',
                    params: { itemId: item.id },
                  })
                }
              >
                <Text style={styles.primaryBtnText}>
                  View claims ({claimCount})
                </Text>
              </Pressable>
            ) : (
              <Text style={styles.note}>
                This is your report. You will be notified when a match is found.
              </Text>
            )
          ) : !showForm ? (
            <Pressable style={styles.primaryBtn} onPress={() => setShowForm(true)}>
              <Text style={styles.primaryBtnText}>
                {isFound ? 'This is mine' : 'I found this'}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.formBox}>
              <Text style={styles.formTitle}>
                {isFound ? 'Verify ownership' : 'Message the owner'}
              </Text>
              <FormField
                label={
                  isFound
                    ? 'Describe the hidden detail'
                    : 'Where and when did you find it?'
                }
                placeholder={
                  isFound
                    ? 'e.g. a sticker, wallpaper, or what is inside'
                    : 'e.g. Library, Monday at 3pm'
                }
                value={answer}
                onChangeText={setAnswer}
                multiline
                style={{ minHeight: 80, textAlignVertical: 'top' }}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable style={styles.primaryBtn} onPress={handleSubmit}>
                <Text style={styles.primaryBtnText}>Send</Text>
              </Pressable>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => {
                  setShowForm(false);
                  setError('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          )}

          <Text style={styles.safety}>
            Safety: you can chat in the app after approval, but always meet at
            the {HANDOVER_POINT.name}. Never share your phone number or meet
            elsewhere.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 40 },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  backText: { color: theme.colors.primary, fontSize: theme.fontSize.lg },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  badgeText: { fontSize: theme.fontSize.sm, fontWeight: '700' },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  description: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  infoBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  infoLabel: { color: theme.colors.textMuted, fontSize: theme.fontSize.md },
  infoValue: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  handover: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  handoverTitle: {
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  handoverText: { color: theme.colors.text, fontSize: theme.fontSize.sm },
  note: {
    backgroundColor: theme.colors.foundBg,
    color: theme.colors.found,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.lg,
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: theme.fontSize.lg, fontWeight: '700' },
  formBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
  formTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  error: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.md,
  },
  cancelBtn: { alignItems: 'center', paddingVertical: theme.spacing.md },
  cancelText: { color: theme.colors.textMuted, fontSize: theme.fontSize.lg },
  safety: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  notFound: {
    textAlign: 'center',
    marginTop: 60,
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.lg,
  },
  link: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
    color: theme.colors.primary,
    fontSize: theme.fontSize.lg,
  },
});