import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/appTheme';
import { fakeItems, fakeMatches } from '../data/fakeItems';

export default function MatchesScreen() {
  const router = useRouter();

  const rows = fakeMatches
    .map((m) => ({
      match: m,
      lost: fakeItems.find((i) => i.id === m.lostItemId),
      found: fakeItems.find((i) => i.id === m.foundItemId),
    }))
    .filter((r) => r.lost && r.found);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Matches</Text>
      <FlatList
        data={rows}
        keyExtractor={(r) => r.match.id}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        ListEmptyComponent={
          <Text style={styles.empty}>No matches yet. We will notify you.</Text>
        }
        renderItem={({ item: r }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/item/[id]',
                params: { id: r.found!.id },
              })
            }
          >
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{r.match.score}% match</Text>
            </View>
            <Text style={styles.label}>Lost</Text>
            <Text style={styles.title}>{r.lost!.title}</Text>
            <Text style={styles.label}>Possible match (found)</Text>
            <Text style={styles.title}>{r.found!.title}</Text>
            <Text style={styles.meta}>
              {r.found!.location} · {r.found!.date}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  heading: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  scoreBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.md,
  },
  scoreText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: theme.fontSize.sm,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  meta: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: theme.colors.textMuted,
  },
});