import { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView, useWindowDimensions, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TargetFace } from '@/components/target-face';
import { Colors, Spacing } from '@/constants/theme';
import { useScoringStore } from '@/store/scoring';
import type { Discipline, BlasonType } from '@/types/scoring';

// --- Config options ---

const SESSION_TYPES: { key: 'entrainement' | 'competition'; label: string }[] = [
  { key: 'entrainement', label: '🎯 Entraînement' },
  { key: 'competition', label: '🏆 Compétition' },
];

const DISCIPLINES: { key: Discipline; label: string }[] = [
  { key: 'salle', label: '🏠 Intérieur' },
  { key: 'tae', label: '🌳 Extérieur' },
  { key: 'campagne', label: '⛰️ Campagne' },
  { key: 'nature', label: '🌲 Nature' },
  { key: '3d', label: '🦌 3D' },
  { key: 'beursault', label: '🏰 Beursault' },
];

const BLASONS_SALLE: { key: BlasonType; label: string }[] = [
  { key: 'tri-spot-40', label: '🔴 Trispot' },
  { key: 'mono-80', label: '⭕ 40 cm' },
];

const BLASONS_EXTERIEUR: { key: BlasonType; label: string }[] = [
  { key: 'mono-60', label: '⭕ 60 cm' },
  { key: 'mono-80-tae', label: '⭕ 80 cm' },
  { key: 'mono-122', label: '⭕ 122 cm' },
];

const DISTANCES_SALLE = [18];
const DISTANCES_EXTERIEUR = [25, 30, 40, 50, 60, 70];

const VOLLEYS_OPTIONS = [4, 6, 8, 10, 12];
const ARROWS_PER_VOLLEY_OPTIONS = [3, 6];
const SERIES_OPTIONS = [1, 2];

const WEATHER_OPTIONS = ['☀️', '⛅', '🌧️', '💨'];
const WIND_OPTIONS = ['🍃 Calme', '💨 Léger', '🌬️ Modéré', '🌪️ Fort'];

type Step = 'config' | 'shooting';

function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: selected ? '#1B5E20' : Colors[colorScheme].backgroundElement },
      ]}
    >
      <ThemedText style={[styles.chipText, selected && { color: '#fff' }]}>{label}</ThemedText>
    </Pressable>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <ThemedText type="subtitle" style={styles.sectionTitle}>{children}</ThemedText>;
}

export default function ScoringScreen() {
  const [step, setStep] = useState<Step>('config');

  // Config state
  const [sessionType, setSessionType] = useState<'entrainement' | 'competition'>('entrainement');
  const [discipline, setDiscipline] = useState<Discipline>('salle');
  const [blason, setBlason] = useState<BlasonType>('tri-spot-40');
  const [distance, setDistance] = useState(18);
  const [series, setSeries] = useState(1);
  const [volleys, setVolleys] = useState(6);
  const [arrowsPerVolley, setArrowsPerVolley] = useState(3);
  const [weather, setWeather] = useState('');
  const [wind, setWind] = useState('');

  const { currentSession, startSession, addArrow, removeLastArrow, endSession, cancelSession, getStats } = useScoringStore();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme() ?? 'light';
  const targetSize = Math.min(width - 48, 400);

  const isSalle = discipline === 'salle';
  const blasons = isSalle ? BLASONS_SALLE : BLASONS_EXTERIEUR;
  const distances = isSalle ? DISTANCES_SALLE : DISTANCES_EXTERIEUR;
  const totalArrows = series * volleys * arrowsPerVolley;
  const maxScore = totalArrows * 10;

  // --- CONFIG SCREEN ---
  if (step === 'config') {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <ThemedText type="title">Tir compté</ThemedText>

            <SectionTitle>Type de séance</SectionTitle>
            <View style={styles.row}>
              {SESSION_TYPES.map((t) => (
                <Chip key={t.key} label={t.label} selected={sessionType === t.key} onPress={() => setSessionType(t.key)} />
              ))}
            </View>

            <SectionTitle>Discipline</SectionTitle>
            <View style={styles.row}>
              {DISCIPLINES.map((d) => (
                <Chip
                  key={d.key}
                  label={d.label}
                  selected={discipline === d.key}
                  onPress={() => {
                    setDiscipline(d.key);
                    if (d.key === 'salle') {
                      setDistance(18);
                      setBlason('tri-spot-40');
                    } else {
                      setDistance(70);
                      setBlason('mono-122');
                    }
                  }}
                />
              ))}
            </View>

            <SectionTitle>Blason</SectionTitle>
            <View style={styles.row}>
              {blasons.map((b) => (
                <Chip key={b.key} label={b.label} selected={blason === b.key} onPress={() => setBlason(b.key)} />
              ))}
            </View>

            <SectionTitle>Distance</SectionTitle>
            {isSalle ? (
              <View style={[styles.infoBox, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
                <ThemedText type="small">📏 18m (distance fixe en salle)</ThemedText>
              </View>
            ) : (
              <View style={styles.row}>
                {distances.map((d) => (
                  <Chip key={d} label={`${d}m`} selected={distance === d} onPress={() => setDistance(d)} />
                ))}
              </View>
            )}

            <SectionTitle>Configuration du tir</SectionTitle>
            <View style={[styles.configCard, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
              <View style={styles.configRow}>
                <ThemedText>Séries</ThemedText>
                <View style={styles.row}>
                  {SERIES_OPTIONS.map((s) => (
                    <Chip key={s} label={`${s}`} selected={series === s} onPress={() => setSeries(s)} />
                  ))}
                </View>
              </View>
              <View style={styles.configRow}>
                <ThemedText>Volées</ThemedText>
                <View style={styles.row}>
                  {VOLLEYS_OPTIONS.map((v) => (
                    <Chip key={v} label={`${v}`} selected={volleys === v} onPress={() => setVolleys(v)} />
                  ))}
                </View>
              </View>
              <View style={styles.configRow}>
                <ThemedText>Flèches</ThemedText>
                <View style={styles.row}>
                  {ARROWS_PER_VOLLEY_OPTIONS.map((a) => (
                    <Chip key={a} label={`${a}`} selected={arrowsPerVolley === a} onPress={() => setArrowsPerVolley(a)} />
                  ))}
                </View>
              </View>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
              <ThemedText type="subtitle">Résumé</ThemedText>
              <ThemedText>
                {series} série{series > 1 ? 's' : ''} · {volleys} volées · {arrowsPerVolley} flèches → {totalArrows} flèches / {maxScore}
              </ThemedText>
            </View>

            <SectionTitle>Météo</SectionTitle>
            <View style={styles.row}>
              {WEATHER_OPTIONS.map((w) => (
                <Chip key={w} label={w} selected={weather === w} onPress={() => setWeather(weather === w ? '' : w)} />
              ))}
            </View>

            <SectionTitle>Vent</SectionTitle>
            <View style={styles.row}>
              {WIND_OPTIONS.map((w) => (
                <Chip key={w} label={w} selected={wind === w} onPress={() => setWind(wind === w ? '' : w)} />
              ))}
            </View>

            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                startSession({
                  discipline,
                  blason,
                  distance,
                  arrowsPerVolley,
                  totalVolleys: series * volleys,
                });
                setStep('shooting');
              }}
            >
              <ThemedText style={styles.primaryButtonText}>Commencer 🏹</ThemedText>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // --- SHOOTING SCREEN ---
  const stats = getStats();
  const session = currentSession;

  if (!session || !stats) {
    setStep('config');
    return null;
  }

  const currentVolley = Math.floor(session.arrows.length / session.arrowsPerVolley) + 1;
  const sessionComplete = session.arrows.length >= session.arrowsPerVolley * session.totalVolleys;

  const displayVolley = sessionComplete ? session.totalVolleys : currentVolley;
  const currentVolleyArrows = session.arrows.filter((a) => a.volley === displayVolley);
  const volleyScore = currentVolleyArrows.reduce((sum, a) => sum + a.score, 0);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Pressable
              style={styles.quitButton}
              onPress={() => {
                cancelSession();
                setStep('config');
              }}
            >
              <ThemedText style={styles.quitButtonText}>✕ Quitter</ThemedText>
            </Pressable>
            <View style={styles.scoreBox}>
              <ThemedText type="title" style={styles.totalScore}>{stats.totalScore}</ThemedText>
              <ThemedText type="small">/{session.arrowsPerVolley * session.totalVolleys * 10}</ThemedText>
            </View>
          </View>

          <View style={styles.volleyHeader}>
            <ThemedText type="subtitle">
              Volée {Math.min(currentVolley, session.totalVolleys)}/{session.totalVolleys}
            </ThemedText>
            <ThemedText type="small">
              {session.distance}m · {discipline === 'salle' ? 'Salle' : 'Extérieur'} · {stats.arrowCount} flèches
            </ThemedText>
          </View>

          {/* Target */}
          <TargetFace size={targetSize} arrows={session.arrows} onPress={addArrow} />

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
              <ThemedText type="subtitle">{stats.average.toFixed(1)}</ThemedText>
              <ThemedText type="small">Moyenne</ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
              <ThemedText type="subtitle">{stats.xCount}</ThemedText>
              <ThemedText type="small">X</ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
              <ThemedText type="subtitle">{stats.tenCount}</ThemedText>
              <ThemedText type="small">10</ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
              <ThemedText type="subtitle">{volleyScore}</ThemedText>
              <ThemedText type="small">Volée</ThemedText>
            </View>
          </View>

          {/* Current volley arrows */}
          <View style={styles.volleyArrows}>
            {currentVolleyArrows.map((a) => (
              <View key={a.id} style={[styles.arrowBadge, { backgroundColor: a.score >= 9 ? '#FFD600' : a.score >= 7 ? '#F44336' : a.score >= 5 ? '#2196F3' : '#666' }]}>
                <ThemedText style={[styles.arrowBadgeText, a.score >= 9 && { color: '#000' }]}>
                  {a.isX ? 'X' : a.score}
                </ThemedText>
              </View>
            ))}
            {Array.from({ length: session.arrowsPerVolley - currentVolleyArrows.length }).map((_, i) => (
              <View key={`empty-${i}`} style={[styles.arrowBadge, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
                <ThemedText style={styles.arrowBadgeText}>-</ThemedText>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable style={styles.secondaryButton} onPress={removeLastArrow}>
              <ThemedText style={styles.secondaryButtonText}>↩ Annuler flèche</ThemedText>
            </Pressable>
            {sessionComplete && (
              <Pressable
                style={styles.primaryButton}
                onPress={() => {
                  endSession();
                  setStep('config');
                }}
              >
                <ThemedText style={styles.primaryButtonText}>Terminer ✓</ThemedText>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four },
  scrollContent: { gap: Spacing.three, paddingBottom: 100 },
  sectionTitle: { marginTop: Spacing.two },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Spacing.three, minWidth: 60, alignItems: 'center' },
  chipText: { fontSize: 14, fontWeight: '600' },
  configCard: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.three },
  configRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  summaryCard: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.one },
  infoBox: { padding: Spacing.three, borderRadius: Spacing.two },
  primaryButton: { backgroundColor: '#1B5E20', paddingVertical: Spacing.three, paddingHorizontal: Spacing.five, borderRadius: Spacing.three, alignItems: 'center', marginTop: Spacing.two },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  secondaryButton: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Spacing.three, borderWidth: 1, borderColor: '#666' },
  secondaryButtonText: { fontSize: 14 },
  // Shooting screen
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.four },
  volleyHeader: { gap: 2 },
  quitButton: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Spacing.two, backgroundColor: '#B71C1C' },
  quitButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  scoreBox: { alignItems: 'flex-end' },
  totalScore: { fontSize: 36, lineHeight: 40 },
  statsRow: { flexDirection: 'row', gap: Spacing.two },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: Spacing.three, borderRadius: Spacing.three },
  volleyArrows: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.two },
  arrowBadge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  arrowBadgeText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.three, marginTop: Spacing.two },
});
