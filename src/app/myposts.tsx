import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemCard } from '../components/ItemCard';
import { theme } from '../constants/appTheme';
import { useItems } from '../context/ItemsContext';

export default function MyPostsScreen() {
  const router = useRouter();
  const { items, myItemIds } = useItems();
  const myItems = items.filter((i) => myItemIds.includes(i.id));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My posts</Text>
      <FlatList
        data={myItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        ListEmptyComponent={
          <Text style={styles.empty}>You have not posted anything yet.</Text>
        }
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
  heading: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: theme.colors.textMuted,
  },
});