import { StyleSheet, View, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useScoringStore } from '@/store/scoring';
import type { Session } from '@/types/scoring';

const DISCIPLINE_LABELS: Record<string, string> = {
  salle: '🏠 Salle',
  tae: '🌳 TAE',
  campagne: '⛰️ Campagne',
  nature: '🌲 Nature',
  '3d': '🦌 3D',
  beursault: '🏰 Beursault',
};

function SessionCard({ session }: { session: Session }) {
  const colorScheme = useColorScheme() ?? 'light';

  const totalScore = session.arrows.reduce((sum, a) => sum + a.score, 0);
  const maxScore = session.arrowsPerVolley * session.totalVolleys * 10;
  const avg = session.arrows.length > 0 ? (totalScore / session.arrows.length).toFixed(1) : '0';
  const xCount = session.arrows.filter((a) => a.isX).length;
  const tenCount = session.arrows.filter((a) => a.score === 10).length;
  const percentage = maxScore > 0 ? ((totalScore / maxScore) * 100).toFixed(1) : '0';

  const date = new Date(session.date);
  const dateStr = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.card, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
      <View style={styles.cardHeader}>
        <View>
          <ThemedText type="subtitle">{totalScore}/{maxScore}</ThemedText>
          <ThemedText type="small">{percentage}%</ThemedText>
        </View>
        <View style={styles.cardMeta}>
          <ThemedText type="small">{dateStr} · {timeStr}</ThemedText>
          <ThemedText type="small">
            {DISCIPLINE_LABELS[session.discipline] || session.discipline} · {session.distance}m
          </ThemedText>
        </View>
      </View>

      <View style={styles.miniStats}>
        <View style={styles.miniStat}>
          <ThemedText style={styles.miniStatValue}>{avg}</ThemedText>
          <ThemedText type="small">Moy.</ThemedText>
        </View>
        <View style={styles.miniStat}>
          <ThemedText style={styles.miniStatValue}>{xCount}</ThemedText>
          <ThemedText type="small">X</ThemedText>
        </View>
        <View style={styles.miniStat}>
          <ThemedText style={styles.miniStatValue}>{tenCount}</ThemedText>
          <ThemedText type="small">10</ThemedText>
        </View>
        <View style={styles.miniStat}>
          <ThemedText style={styles.miniStatValue}>{session.arrows.length}</ThemedText>
          <ThemedText type="small">Flèches</ThemedText>
        </View>
      </View>

      {/* Volley breakdown */}
      <View style={styles.volleyBreakdown}>
        {Array.from({ length: session.totalVolleys }).map((_, vi) => {
          const volleyArrows = session.arrows.filter((a) => a.volley === vi + 1);
          const vScore = volleyArrows.reduce((s, a) => s + a.score, 0);
          return (
            <View key={vi} style={styles.volleyChip}>
              <ThemedText type="small" style={styles.volleyChipText}>V{vi + 1}: {vScore}</ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { sessions } = useScoringStore();
  const sortedSessions = [...sessions].reverse();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>Historique</ThemedText>

        {sortedSessions.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText style={styles.emptyEmoji}>📋</ThemedText>
            <ThemedText type="subtitle">Aucune séance</ThemedText>
            <ThemedText type="small">Tes séances terminées apparaîtront ici.</ThemedText>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            <ThemedText type="small">{sortedSessions.length} séance{sortedSessions.length > 1 ? 's' : ''}</ThemedText>
            {sortedSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four },
  title: { marginTop: Spacing.four, marginBottom: Spacing.three },
  list: { gap: Spacing.three, paddingBottom: 100 },
  card: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.three },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardMeta: { alignItems: 'flex-end', gap: 2 },
  miniStats: { flexDirection: 'row', gap: Spacing.two },
  miniStat: { flex: 1, alignItems: 'center' },
  miniStatValue: { fontWeight: '700', fontSize: 16 },
  volleyBreakdown: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  volleyChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: 'rgba(128,128,128,0.2)' },
  volleyChipText: { fontSize: 11 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  emptyEmoji: { fontSize: 48 },
});
