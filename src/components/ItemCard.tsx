import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/appTheme';
import type { Item } from '../types/item';

type Props = { item: Item; onPress?: () => void };

export function ItemCard({ item, onPress }: Props) {
  const isLost = item.type === 'lost';
  const { colors } = theme;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.badge,
            { backgroundColor: isLost ? colors.lostBg : colors.foundBg },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isLost ? colors.lost : colors.found },
            ]}
          >
            {isLost ? 'Lost' : 'Found'}
          </Text>
        </View>
        <Text style={styles.category}>{item.category}</Text>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.meta}>
        {item.location} · {item.date}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressed: { opacity: 0.7 },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  badgeText: { fontSize: theme.fontSize.sm, fontWeight: '700' },
  category: { fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  meta: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
  },
});