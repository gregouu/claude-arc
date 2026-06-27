import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useUserStore } from '@/store/user';
import { useColorScheme } from 'react-native';

function QuickAction({ icon, label }: { icon: string; label: string }) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View style={[styles.quickAction, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
      <ThemedText style={styles.quickActionIcon}>{icon}</ThemedText>
      <ThemedText type="small">{label}</ThemedText>
    </View>
  );
}

export default function DashboardScreen() {
  const firstName = useUserStore((s) => s.firstName);
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.greeting}>
          Bonjour {firstName} 🏹
        </ThemedText>

        <ThemedText type="small" style={styles.subtitle}>
          Prêt pour l'entraînement ?
        </ThemedText>

        <View style={styles.quickActions}>
          <QuickAction icon="🎯" label="Nouvelle séance" />
          <QuickAction icon="🪪" label="Ma licence" />
          <QuickAction icon="🏹" label="Mon matériel" />
          <QuickAction icon="📊" label="Statistiques" />
        </View>

        <View style={[styles.card, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
          <ThemedText type="subtitle">Progression</ThemedText>
          <ThemedText type="small" style={styles.cardContent}>
            Aucune séance enregistrée. Lance ta première séance de tir !
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
          <ThemedText type="subtitle">Prochains événements</ThemedText>
          <ThemedText type="small" style={styles.cardContent}>
            Aucune compétition à venir.
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  greeting: {
    marginTop: Spacing.four,
  },
  subtitle: {
    marginTop: -Spacing.two,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  quickAction: {
    flex: 1,
    minWidth: 140,
    alignItems: 'center',
    paddingVertical: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  quickActionIcon: {
    fontSize: 32,
  },
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  cardContent: {
    lineHeight: 22,
  },
});
