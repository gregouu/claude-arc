import { StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useUserStore } from '@/store/user';
import { useScoringStore } from '@/store/scoring';
import { useLicenseStore } from '@/store/license';
import { useColorScheme } from 'react-native';

function QuickAction({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <Pressable onPress={onPress} style={[styles.quickAction, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
      <ThemedText style={styles.quickActionIcon}>{icon}</ThemedText>
      <ThemedText type="small">{label}</ThemedText>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const firstName = useUserStore((s) => s.firstName);
  const { sessions } = useScoringStore();
  const { license } = useLicenseStore();
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();

  const totalSessions = sessions.length;
  const totalArrows = sessions.reduce((sum, s) => sum + s.arrows.length, 0);
  const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
  const lastScore = lastSession
    ? lastSession.arrows.reduce((sum, a) => sum + a.score, 0)
    : null;
  const lastMax = lastSession
    ? lastSession.arrowsPerVolley * lastSession.totalVolleys * 10
    : null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.greeting}>
          Bonjour {firstName} 🏹
        </ThemedText>

        <ThemedText type="small" style={styles.subtitle}>
          {license.category}-{license.gender}-{license.weapon} · {license.club}
        </ThemedText>

        <View style={styles.quickActions}>
          <QuickAction icon="🎯" label="Nouvelle séance" onPress={() => router.push('/scoring')} />
          <QuickAction icon="🪪" label="Ma licence" onPress={() => router.push('/license')} />
          <QuickAction icon="📋" label="Historique" onPress={() => router.push('/history')} />
          <QuickAction icon="👤" label="Mon profil" onPress={() => router.push('/profile')} />
        </View>

        <View style={[styles.card, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
          <ThemedText type="subtitle">Résumé</ThemedText>
          {totalSessions > 0 ? (
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <ThemedText type="subtitle">{totalSessions}</ThemedText>
                <ThemedText type="small">Séances</ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText type="subtitle">{totalArrows}</ThemedText>
                <ThemedText type="small">Flèches</ThemedText>
              </View>
              {lastScore !== null && lastMax !== null && (
                <View style={styles.summaryItem}>
                  <ThemedText type="subtitle">{lastScore}/{lastMax}</ThemedText>
                  <ThemedText type="small">Dernier score</ThemedText>
                </View>
              )}
            </View>
          ) : (
            <ThemedText type="small">Aucune séance. Lance ton premier tir !</ThemedText>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
          <ThemedText type="subtitle">Prochains événements</ThemedText>
          <ThemedText type="small">Aucune compétition à venir.</ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, gap: Spacing.three },
  greeting: { marginTop: Spacing.four },
  subtitle: { marginTop: -Spacing.two },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginTop: Spacing.two },
  quickAction: { flex: 1, minWidth: 140, alignItems: 'center', paddingVertical: Spacing.four, borderRadius: Spacing.three, gap: Spacing.two },
  quickActionIcon: { fontSize: 32 },
  card: { padding: Spacing.four, borderRadius: Spacing.three, gap: Spacing.two },
  summaryRow: { flexDirection: 'row', gap: Spacing.three },
  summaryItem: { flex: 1, alignItems: 'center' },
});
