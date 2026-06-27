import { StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { QRCode } from '@/components/qr-code';
import { Colors, Spacing } from '@/constants/theme';
import { useLicenseStore } from '@/store/license';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText type="small" style={styles.label}>{label}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
    </View>
  );
}

function QRPlaceholder({ data }: { data: string }) {
  const size = 160;
  const gridSize = 8;
  const cellSize = size / gridSize;
  const cells = [];

  // Simple deterministic pattern from string
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const charCode = data.charCodeAt((row * gridSize + col) % data.length);
      const isFilled = charCode % 3 !== 0;
      // Corner markers
      const isCorner =
        (row < 2 && col < 2) ||
        (row < 2 && col >= gridSize - 2) ||
        (row >= gridSize - 2 && col < 2);

      if (isFilled || isCorner) {
        cells.push(
          <View
            key={`${row}-${col}`}
            style={{
              position: 'absolute',
              left: col * cellSize,
              top: row * cellSize,
              width: cellSize - 1,
              height: cellSize - 1,
              backgroundColor: '#000',
            }}
          />
        );
      }
    }
  }

  return (
    <View style={[styles.qrContainer, { width: size, height: size }]}>
      <View style={{ width: size, height: size, backgroundColor: '#fff', borderRadius: 8, padding: 8 }}>
        <View style={{ flex: 1, position: 'relative' }}>{cells}</View>
      </View>
      <ThemedText type="small" style={styles.qrHint}>Scanner au greffe</ThemedText>
    </View>
  );
}

function StatusBadge({ valid }: { valid: boolean }) {
  return (
    <View style={[styles.statusBadge, { backgroundColor: valid ? '#1B5E20' : '#B71C1C' }]}>
      <ThemedText style={styles.statusText}>{valid ? '✓ Valide' : '✕ Expirée'}</ThemedText>
    </View>
  );
}

export default function LicenseScreen() {
  const { license } = useLicenseStore();
  const colorScheme = useColorScheme() ?? 'light';

  const isValid = new Date(license.validUntil) > new Date();
  const categoryLabel = `${license.category} - ${license.gender} - ${license.weapon}`;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title">Ma Licence</ThemedText>
          <StatusBadge valid={isValid} />
        </View>

        {/* License card */}
        <View style={[styles.card, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
          <View style={styles.cardHeader}>
            <View style={styles.ffta}>
              <ThemedText style={styles.fftaText}>FFTA</ThemedText>
              <ThemedText type="small">Fédération Française de Tir à l'Arc</ThemedText>
            </View>
            <ThemedText type="small">Saison {license.season}</ThemedText>
          </View>

          <View style={styles.identity}>
            <View style={[styles.photoPlaceholder, { backgroundColor: Colors[colorScheme].backgroundSelected || '#ccc' }]}>
              <ThemedText style={styles.photoEmoji}>🏹</ThemedText>
            </View>
            <View style={styles.nameBlock}>
              <ThemedText type="subtitle">{license.lastName}</ThemedText>
              <ThemedText>{license.firstName}</ThemedText>
              <ThemedText type="small" style={styles.category}>{categoryLabel}</ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          <InfoRow label="N° Licence" value={license.number} />
          <InfoRow label="Club" value={license.club} />
          <InfoRow label="N° Club" value={license.clubNumber} />
          <InfoRow label="Valide jusqu'au" value={new Date(license.validUntil).toLocaleDateString('fr-FR')} />
          {license.medicalCertificateDate && (
            <InfoRow label="Certificat médical" value={new Date(license.medicalCertificateDate).toLocaleDateString('fr-FR')} />
          )}
        </View>

        {/* QR Code */}
        <QRCode data={`FFTA-${license.number}-${license.season}-${license.lastName}`} size={180} />

        <View style={[styles.offlineNote, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
          <ThemedText type="small">📱 Disponible hors ligne — Présentez ce QR code au greffe</ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, gap: Spacing.three },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.four },
  card: { borderRadius: Spacing.three, padding: Spacing.four, gap: Spacing.three },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  ffta: { gap: 2 },
  fftaText: { fontSize: 20, fontWeight: '900', color: '#1565C0' },
  identity: { flexDirection: 'row', gap: Spacing.three, alignItems: 'center' },
  photoPlaceholder: { width: 64, height: 80, borderRadius: Spacing.two, alignItems: 'center', justifyContent: 'center' },
  photoEmoji: { fontSize: 28 },
  nameBlock: { flex: 1, gap: 2 },
  category: { marginTop: 4, fontWeight: '700', color: '#1565C0' },
  divider: { height: 1, backgroundColor: '#333', opacity: 0.2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { flex: 1 },
  value: { fontWeight: '600', textAlign: 'right' },
  qrContainer: { alignSelf: 'center', alignItems: 'center', gap: Spacing.two },
  qrHint: { textAlign: 'center' },
  statusBadge: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, borderRadius: Spacing.three },
  statusText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  offlineNote: { padding: Spacing.three, borderRadius: Spacing.two, alignItems: 'center' },
});
