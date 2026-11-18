import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../constants/appTheme';
import {
  fakeClaims,
  fakePrivateDetails,
  HANDOVER_POINT,
} from '../../data/fakeClaims';
import { fakeItems } from '../../data/fakeItems';
import type { Claim, ClaimStatus } from '../../types/claim';

const STATUS_STYLE: Record<
  ClaimStatus,
  { label: string; bg: string; color: string }
> = {
  pending: {
    label: 'Pending',
    bg: theme.colors.primaryLight,
    color: theme.colors.primary,
  },
  approved: {
    label: 'Approved',
    bg: theme.colors.foundBg,
    color: theme.colors.found,
  },
  rejected: {
    label: 'Rejected',
    bg: theme.colors.lostBg,
    color: theme.colors.danger,
  },
  on_hold: {
    label: 'On hold',
    bg: theme.colors.border,
    color: theme.colors.textMuted,
  },
};

export default function ClaimsScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const router = useRouter();

  const [claims, setClaims] = useState<Claim[]>(() =>
    fakeClaims.filter((c) => c.itemId === itemId)
  );

  const item = fakeItems.find((i) => i.id === itemId);
  const privateDetail = fakePrivateDetails[itemId ?? ''];
  const approved = claims.find((c) => c.status === 'approved');

  const approve = (id: string) => {
    Alert.alert(
      'Approve this claim?',
      'Other pending claims will be put on hold. You will then arrange the handover at the safe point.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () =>
            setClaims((prev) =>
              prev.map((c) =>
                c.id === id
                  ? { ...c, status: 'approved' }
                  : c.status === 'pending'
                  ? { ...c, status: 'on_hold' }
                  : c
              )
            ),
        },
      ]
    );
  };

  const reject = (id: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'rejected' } : c))
    );
  };

  // Approved person did not show up: reject them and revive the held claims
  const cancelApproval = () => {
    Alert.alert(
      'Cancel approval?',
      'Use this if the person did not come for the handover. Held claims will become pending again.',
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Cancel approval',
          style: 'destructive',
          onPress: () =>
            setClaims((prev) =>
              prev.map((c) =>
                c.status === 'approved'
                  ? { ...c, status: 'rejected' }
                  : c.status === 'on_hold'
                  ? { ...c, status: 'pending' }
                  : c
              )
            ),
        },
      ]
    );
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.empty}>This item could not be found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.primary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.heading}>Claims</Text>
        <Text style={styles.itemTitle}>{item.title}</Text>

        <View style={styles.privateBox}>
          <Text style={styles.privateTitle}>Your private detail</Text>
          <Text style={styles.privateText}>
            {privateDetail ?? 'No private detail was saved.'}
          </Text>
          <Text style={styles.privateHint}>
            Only you can see this. Compare it with each answer below. Never tell
            anyone what it is.
          </Text>
        </View>

        {claims.length === 0 ? (
          <Text style={styles.empty}>No one has claimed this item yet.</Text>
        ) : null}

        {claims.map((claim, index) => {
          const s = STATUS_STYLE[claim.status];
          const isApproved = claim.status === 'approved';
          return (
            <View key={claim.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.claimer}>
                  {isApproved ? claim.claimerName : `Claimant ${index + 1}`}
                </Text>
                <View style={[styles.badge, { backgroundColor: s.bg }]}>
                  <Text style={[styles.badgeText, { color: s.color }]}>
                    {s.label}
                  </Text>
                </View>
              </View>

              <Text style={styles.label}>Their answer</Text>
              <Text style={styles.answer}>{claim.answer}</Text>
              <Text style={styles.date}>Sent {claim.createdAt}</Text>

              {claim.status === 'pending' ? (
                <View style={styles.actions}>
                  <Pressable
                    style={[styles.btn, styles.approveBtn]}
                    onPress={() => approve(claim.id)}
                  >
                    <Text style={styles.approveText}>Approve</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.btn, styles.rejectBtn]}
                    onPress={() => reject(claim.id)}
                  >
                    <Text style={styles.rejectText}>Reject</Text>
                  </Pressable>
                </View>
              ) : null}

              {isApproved ? (
                <View>
                  <View style={styles.handover}>
                    <Text style={styles.handoverTitle}>Handover</Text>
                    <Text style={styles.handoverText}>
                      Meet only at the {HANDOVER_POINT.name} ({HANDOVER_POINT.hours}
                      ). Never meet anywhere else.
                    </Text>
                  </View>
                  <Pressable
                    style={[styles.btn, styles.approveBtn]}
                    onPress={() =>
                      Alert.alert('Coming next', 'Chat is the next step.')
                    }
                  >
                    <Text style={styles.approveText}>Open chat</Text>
                  </Pressable>
                  <Pressable style={styles.linkBtn} onPress={cancelApproval}>
                    <Text style={styles.linkText}>They did not show up</Text>
                  </Pressable>
                </View>
              ) : null}

              {claim.status === 'on_hold' && approved ? (
                <Text style={styles.holdNote}>
                  Waiting: another claim is being handled.
                </Text>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
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
  heading: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  itemTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
  },
  privateBox: {
    backgroundColor: theme.colors.foundBg,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  privateTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.found,
  },
  privateText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginVertical: theme.spacing.sm,
  },
  privateHint: { fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  claimer: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  badgeText: { fontSize: theme.fontSize.sm, fontWeight: '700' },
  label: { fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
  answer: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  date: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  btn: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  approveBtn: { backgroundColor: theme.colors.primary },
  approveText: { color: '#FFFFFF', fontWeight: '700', fontSize: theme.fontSize.lg },
  rejectBtn: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  rejectText: {
    color: theme.colors.danger,
    fontWeight: '700',
    fontSize: theme.fontSize.lg,
  },
  handover: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  handoverTitle: {
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  handoverText: { color: theme.colors.text, fontSize: theme.fontSize.md },
  linkBtn: { alignItems: 'center', paddingVertical: theme.spacing.md },
  linkText: { color: theme.colors.danger, fontSize: theme.fontSize.md },
  holdNote: {
    marginTop: theme.spacing.md,
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: theme.colors.textMuted,
  },
});