import { StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useLicenseStore } from '@/store/license';
import { useScoringStore } from '@/store/scoring';

function StatBlock({ value, label, color }: { value: string; label: string; color?: string }) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View style={[styles.statBlock, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
      <ThemedText type="subtitle" style={color ? { color } : undefined}>{value}</ThemedText>
      <ThemedText type="small">{label}</ThemedText>
    </View>
  );
}

function AchievementBadge({ emoji, label, unlocked }: { emoji: string; label: string; unlocked: boolean }) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View style={[styles.badge, { backgroundColor: Colors[colorScheme].backgroundElement, opacity: unlocked ? 1 : 0.4 }]}>
      <ThemedText style={styles.badgeEmoji}>{emoji}</ThemedText>
      <ThemedText type="small" style={styles.badgeLabel}>{label}</ThemedText>
    </View>
  );
}

export default function ProfileScreen() {
  const { license } = useLicenseStore();
  const { sessions } = useScoringStore();
  const colorScheme = useColorScheme() ?? 'light';

  const totalArrows = sessions.reduce((sum, s) => sum + s.arrows.length, 0);
  const totalSessions = sessions.length;

  const allScores = sessions.map((s) => {
    const total = s.arrows.reduce((sum, a) => sum + a.score, 0);
    const max = s.arrowsPerVolley * s.totalVolleys * 10;
    return { total, max, percentage: max > 0 ? (total / max) * 100 : 0 };
  });

  const bestScore = allScores.length > 0 ? Math.max(...allScores.map((s) => s.total)) : 0;
  const avgPercentage = allScores.length > 0
    ? (allScores.reduce((sum, s) => sum + s.percentage, 0) / allScores.length).toFixed(1)
    : '0';

  const totalX = sessions.reduce((sum, s) => sum + s.arrows.filter((a) => a.isX).length, 0);
  const categoryLabel = `${license.category} - ${license.gender} - ${license.weapon}`;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Identity */}
        <View style={[styles.profileCard, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
          <View style={[styles.avatar, { backgroundColor: '#1565C0' }]}>
            <ThemedText style={styles.avatarText}>
              {license.firstName[0]}{license.lastName[0]}
            </ThemedText>
          </View>
          <View style={styles.profileInfo}>
            <ThemedText type="title">{license.firstName} {license.lastName}</ThemedText>
            <ThemedText style={styles.categoryBadge}>{categoryLabel}</ThemedText>
            <ThemedText type="small">{license.club}</ThemedText>
            <ThemedText type="small">Licence n°{license.number}</ThemedText>
          </View>
        </View>

        {/* Stats */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Statistiques</ThemedText>
        <View style={styles.statsGrid}>
          <StatBlock value={`${totalSessions}`} label="Séances" />
          <StatBlock value={`${totalArrows}`} label="Flèches" />
          <StatBlock value={`${bestScore}`} label="Meilleur" color="#FFD600" />
          <StatBlock value={`${avgPercentage}%`} label="Moyenne" />
          <StatBlock value={`${totalX}`} label="X" color="#1B5E20" />
        </View>

        {/* Achievements */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Distinctions</ThemedText>
        <View style={styles.badgesGrid}>
          <AchievementBadge emoji="🎯" label="1ère séance" unlocked={totalSessions >= 1} />
          <AchievementBadge emoji="🔥" label="10 séances" unlocked={totalSessions >= 10} />
          <AchievementBadge emoji="💯" label="100 flèches" unlocked={totalArrows >= 100} />
          <AchievementBadge emoji="🏆" label="1000 flèches" unlocked={totalArrows >= 1000} />
          <AchievementBadge emoji="❌" label="10 X" unlocked={totalX >= 10} />
          <AchievementBadge emoji="🎖️" label="50 X" unlocked={totalX >= 50} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, gap: Spacing.three },
  profileCard: { flexDirection: 'row', padding: Spacing.four, borderRadius: Spacing.three, gap: Spacing.three, alignItems: 'center', marginTop: Spacing.four },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  profileInfo: { flex: 1, gap: 2 },
  categoryBadge: { color: '#1565C0', fontWeight: '700', fontSize: 14 },
  sectionTitle: { marginTop: Spacing.two },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  statBlock: { minWidth: 100, flex: 1, alignItems: 'center', paddingVertical: Spacing.three, borderRadius: Spacing.three },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  badge: { alignItems: 'center', paddingVertical: Spacing.three, paddingHorizontal: Spacing.three, borderRadius: Spacing.three, minWidth: 90, flex: 1 },
  badgeEmoji: { fontSize: 28 },
  badgeLabel: { marginTop: 4, textAlign: 'center' },
});
