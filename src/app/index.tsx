import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemCard } from '../components/ItemCard';
import { theme } from '../constants/appTheme';
import { useItems } from '../context/ItemsContext';
import type { ItemType } from '../types/item';

const TABS: { key: ItemType; label: string }[] = [
  { key: 'lost', label: 'Lost' },
  { key: 'found', label: 'Found' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { items: allItems } = useItems();
  const [tab, setTab] = useState<ItemType>('lost');
  const [search, setSearch] = useState('');

  const items = allItems.filter(
    (item) =>
      item.type === tab &&
      `${item.title} ${item.description} ${item.location}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appName}>findMyStuff</Text>

      <View style={styles.tabs}>
        {TABS.map(({ key, label }) => (
          <Pressable
            key={key}
            style={[styles.tab, tab === key && styles.tabActive]}
            onPress={() => setTab(key)}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search items, places..."
        placeholderTextColor={theme.colors.textMuted}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        ListEmptyComponent={<Text style={styles.empty}>No items found.</Text>}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() =>
              router.push({ pathname: '/item/[id]', params: { id: item.id } })
            }
          />
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
  appName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: theme.colors.surface },
  tabText: { fontSize: theme.fontSize.lg, color: theme.colors.textMuted },
  tabTextActive: { color: theme.colors.primary, fontWeight: '600' },
  search: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: theme.colors.textMuted,
  },
});