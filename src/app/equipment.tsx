import { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView, TextInput, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useEquipmentStore } from '@/store/equipment';
import type { BowSetup, ArrowSet } from '@/types/equipment';

type Tab = 'bows' | 'arrows';
type View_Mode = 'list' | 'add-bow' | 'add-arrows';

const BOW_TYPES = [
  { key: 'classique', label: '🏹 Classique' },
  { key: 'compound', label: '⚙️ Compound' },
  { key: 'barebow', label: '🎯 Barebow' },
  { key: 'longbow', label: '🪵 Longbow' },
] as const;

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View style={styles.fieldContainer}>
      <ThemedText type="small" style={styles.fieldLabel}>{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || label}
        placeholderTextColor="#666"
        style={[styles.input, { backgroundColor: Colors[colorScheme].backgroundElement, color: Colors[colorScheme].text }]}
      />
    </View>
  );
}

function BowCard({ bow, onDelete }: { bow: BowSetup; onDelete: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View style={[styles.card, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
      <View style={styles.cardHeader}>
        <View>
          <ThemedText type="subtitle">{bow.name}</ThemedText>
          <ThemedText type="small">{BOW_TYPES.find((t) => t.key === bow.type)?.label}</ThemedText>
        </View>
        <Pressable onPress={onDelete}>
          <ThemedText style={styles.deleteBtn}>✕</ThemedText>
        </Pressable>
      </View>
      {bow.riser && <InfoLine label="Poignée" value={bow.riser} />}
      {bow.limbs && <InfoLine label="Branches" value={`${bow.limbs} ${bow.limbsPoundage ? `(${bow.limbsPoundage})` : ''}`} />}
      {bow.string && <InfoLine label="Corde" value={bow.string} />}
      {bow.sight && <InfoLine label="Viseur" value={bow.sight} />}
      {bow.stabilization && <InfoLine label="Stabilisation" value={bow.stabilization} />}
      {bow.arrowRest && <InfoLine label="Repose-flèche" value={bow.arrowRest} />}
      {bow.clicker && <InfoLine label="Clicker" value="Oui" />}
      {bow.notes && <ThemedText type="small" style={styles.notes}>{bow.notes}</ThemedText>}
    </View>
  );
}

function ArrowCard({ arrows, onDelete }: { arrows: ArrowSet; onDelete: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View style={[styles.card, { backgroundColor: Colors[colorScheme].backgroundElement }]}>
      <View style={styles.cardHeader}>
        <View>
          <ThemedText type="subtitle">{arrows.name}</ThemedText>
          <ThemedText type="small">{arrows.brand} {arrows.model}</ThemedText>
        </View>
        <Pressable onPress={onDelete}>
          <ThemedText style={styles.deleteBtn}>✕</ThemedText>
        </Pressable>
      </View>
      {arrows.spine && <InfoLine label="Spine" value={arrows.spine} />}
      {arrows.length && <InfoLine label="Longueur" value={arrows.length} />}
      {arrows.points && <InfoLine label="Pointes" value={arrows.points} />}
      {arrows.fletching && <InfoLine label="Plumes" value={arrows.fletching} />}
      <InfoLine label="Quantité" value={`${arrows.quantity}`} />
      <InfoLine label="Tirs estimés" value={`~${arrows.estimatedShots}`} />
    </View>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoLine}>
      <ThemedText type="small" style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText type="small" style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

export default function EquipmentScreen() {
  const [tab, setTab] = useState<Tab>('bows');
  const [viewMode, setViewMode] = useState<View_Mode>('list');
  const colorScheme = useColorScheme() ?? 'light';

  const { bows, arrowSets, addBow, removeBow, addArrowSet, removeArrowSet } = useEquipmentStore();

  // Bow form
  const [bowName, setBowName] = useState('');
  const [bowType, setBowType] = useState<BowSetup['type']>('classique');
  const [riser, setRiser] = useState('');
  const [limbs, setLimbs] = useState('');
  const [limbsPoundage, setLimbsPoundage] = useState('');
  const [bowString, setBowString] = useState('');
  const [sight, setSight] = useState('');
  const [stabilization, setStabilization] = useState('');
  const [arrowRest, setArrowRest] = useState('');
  const [clicker, setClicker] = useState(false);
  const [berger, setBerger] = useState('');
  const [bowNotes, setBowNotes] = useState('');

  // Arrow form
  const [arrowName, setArrowName] = useState('');
  const [arrowBrand, setArrowBrand] = useState('');
  const [arrowModel, setArrowModel] = useState('');
  const [spine, setSpine] = useState('');
  const [arrowLength, setArrowLength] = useState('');
  const [points, setPoints] = useState('');
  const [fletching, setFletching] = useState('');
  const [nocks, setNocks] = useState('');
  const [quantity, setQuantity] = useState('12');
  const [arrowNotes, setArrowNotes] = useState('');

  const resetBowForm = () => {
    setBowName(''); setRiser(''); setLimbs(''); setLimbsPoundage('');
    setBowString(''); setSight(''); setStabilization(''); setArrowRest('');
    setClicker(false); setBerger(''); setBowNotes('');
  };

  const resetArrowForm = () => {
    setArrowName(''); setArrowBrand(''); setArrowModel(''); setSpine('');
    setArrowLength(''); setPoints(''); setFletching(''); setNocks('');
    setQuantity('12'); setArrowNotes('');
  };

  // ADD BOW FORM
  if (viewMode === 'add-bow') {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <ThemedText type="title">Nouvel arc</ThemedText>

            <ThemedText type="small" style={styles.sectionLabel}>Type d'arc</ThemedText>
            <View style={styles.row}>
              {BOW_TYPES.map((t) => (
                <Pressable
                  key={t.key}
                  onPress={() => setBowType(t.key)}
                  style={[styles.chip, { backgroundColor: bowType === t.key ? '#1B5E20' : Colors[colorScheme].backgroundElement }]}
                >
                  <ThemedText style={bowType === t.key ? { color: '#fff' } : undefined}>{t.label}</ThemedText>
                </Pressable>
              ))}
            </View>

            <Field label="Nom" value={bowName} onChange={setBowName} placeholder="Mon arc classique" />
            <Field label="Poignée" value={riser} onChange={setRiser} placeholder="Hoyt Formula Xi" />
            <Field label="Branches" value={limbs} onChange={setLimbs} placeholder="MK Korea Limbs" />
            <Field label="Puissance" value={limbsPoundage} onChange={setLimbsPoundage} placeholder="34 lbs" />
            <Field label="Corde" value={bowString} onChange={setBowString} placeholder="BCY 8125" />
            <Field label="Viseur" value={sight} onChange={setSight} placeholder="Shibuya Dual Click" />
            <Field label="Stabilisation" value={stabilization} onChange={setStabilization} placeholder="Doinker Platinium" />
            <Field label="Repose-flèche" value={arrowRest} onChange={setArrowRest} placeholder="Shibuya DX" />
            <Field label="Berger" value={berger} onChange={setBerger} placeholder="Beiter" />

            <Pressable onPress={() => setClicker(!clicker)} style={[styles.chip, { backgroundColor: clicker ? '#1B5E20' : Colors[colorScheme].backgroundElement, alignSelf: 'flex-start' }]}>
              <ThemedText style={clicker ? { color: '#fff' } : undefined}>{clicker ? '✓ Clicker' : '○ Clicker'}</ThemedText>
            </Pressable>

            <Field label="Notes" value={bowNotes} onChange={setBowNotes} placeholder="Remarques..." />

            <View style={styles.actionsRow}>
              <Pressable style={styles.cancelBtn} onPress={() => { resetBowForm(); setViewMode('list'); }}>
                <ThemedText>Annuler</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, !bowName && { opacity: 0.4 }]}
                onPress={() => {
                  if (!bowName) return;
                  addBow({ name: bowName, type: bowType, riser, limbs, limbsPoundage, string: bowString, sight, stabilization, clicker, arrowRest, berger, notes: bowNotes });
                  resetBowForm();
                  setViewMode('list');
                }}
              >
                <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Enregistrer</ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // ADD ARROWS FORM
  if (viewMode === 'add-arrows') {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <ThemedText type="title">Nouveau jeu de flèches</ThemedText>

            <Field label="Nom" value={arrowName} onChange={setArrowName} placeholder="Flèches compétition" />
            <Field label="Marque" value={arrowBrand} onChange={setArrowBrand} placeholder="Easton" />
            <Field label="Modèle" value={arrowModel} onChange={setArrowModel} placeholder="X10" />
            <Field label="Spine" value={spine} onChange={setSpine} placeholder="600" />
            <Field label="Longueur" value={arrowLength} onChange={setArrowLength} placeholder="28 pouces" />
            <Field label="Pointes" value={points} onChange={setPoints} placeholder="100 grains" />
            <Field label="Plumes/Vanes" value={fletching} onChange={setFletching} placeholder="Spin Wings" />
            <Field label="Encoche" value={nocks} onChange={setNocks} placeholder="Beiter" />
            <Field label="Quantité" value={quantity} onChange={setQuantity} placeholder="12" />
            <Field label="Notes" value={arrowNotes} onChange={setArrowNotes} placeholder="Remarques..." />

            <View style={styles.actionsRow}>
              <Pressable style={styles.cancelBtn} onPress={() => { resetArrowForm(); setViewMode('list'); }}>
                <ThemedText>Annuler</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, !arrowName && { opacity: 0.4 }]}
                onPress={() => {
                  if (!arrowName) return;
                  addArrowSet({ name: arrowName, brand: arrowBrand, model: arrowModel, spine, length: arrowLength, points, fletching, nocks, quantity: parseInt(quantity) || 12, estimatedShots: 0, notes: arrowNotes });
                  resetArrowForm();
                  setViewMode('list');
                }}
              >
                <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Enregistrer</ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // LIST VIEW
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>Mon Matériel</ThemedText>

        <View style={styles.tabs}>
          <Pressable onPress={() => setTab('bows')} style={[styles.tab, { backgroundColor: tab === 'bows' ? '#1B5E20' : Colors[colorScheme].backgroundElement }]}>
            <ThemedText style={tab === 'bows' ? { color: '#fff', fontWeight: '700' } : undefined}>🏹 Arcs ({bows.length})</ThemedText>
          </Pressable>
          <Pressable onPress={() => setTab('arrows')} style={[styles.tab, { backgroundColor: tab === 'arrows' ? '#1B5E20' : Colors[colorScheme].backgroundElement }]}>
            <ThemedText style={tab === 'arrows' ? { color: '#fff', fontWeight: '700' } : undefined}>🏹 Flèches ({arrowSets.length})</ThemedText>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {tab === 'bows' ? (
            bows.length === 0 ? (
              <View style={styles.empty}>
                <ThemedText style={styles.emptyEmoji}>🏹</ThemedText>
                <ThemedText type="subtitle">Aucun arc enregistré</ThemedText>
                <ThemedText type="small">Ajoute ton premier arc pour suivre ton matériel.</ThemedText>
              </View>
            ) : (
              bows.map((bow) => <BowCard key={bow.id} bow={bow} onDelete={() => removeBow(bow.id)} />)
            )
          ) : (
            arrowSets.length === 0 ? (
              <View style={styles.empty}>
                <ThemedText style={styles.emptyEmoji}>🎯</ThemedText>
                <ThemedText type="subtitle">Aucune flèche enregistrée</ThemedText>
                <ThemedText type="small">Ajoute ton jeu de flèches.</ThemedText>
              </View>
            ) : (
              arrowSets.map((a) => <ArrowCard key={a.id} arrows={a} onDelete={() => removeArrowSet(a.id)} />)
            )
          )}
        </ScrollView>

        <Pressable
          style={styles.fab}
          onPress={() => setViewMode(tab === 'bows' ? 'add-bow' : 'add-arrows')}
        >
          <ThemedText style={styles.fabText}>+</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four },
  title: { marginTop: Spacing.four, marginBottom: Spacing.two },
  tabs: { flexDirection: 'row', gap: Spacing.two, marginBottom: Spacing.three },
  tab: { flex: 1, paddingVertical: Spacing.two, borderRadius: Spacing.three, alignItems: 'center' },
  scroll: { gap: Spacing.three, paddingBottom: 100 },
  card: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.one },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  deleteBtn: { fontSize: 18, color: '#B71C1C', fontWeight: '700', padding: 4 },
  infoLine: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { flex: 1, opacity: 0.7 },
  infoValue: { fontWeight: '600' },
  notes: { fontStyle: 'italic', marginTop: 4 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: Spacing.two },
  emptyEmoji: { fontSize: 48 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#1B5E20', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: '300', lineHeight: 36 },
  // Form
  sectionLabel: { marginTop: Spacing.two },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Spacing.three },
  fieldContainer: { gap: 4 },
  fieldLabel: { fontWeight: '600' },
  input: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Spacing.two, fontSize: 16 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.three, marginTop: Spacing.three },
  cancelBtn: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.four, borderRadius: Spacing.three, borderWidth: 1, borderColor: '#666' },
  saveBtn: { backgroundColor: '#1B5E20', paddingVertical: Spacing.two, paddingHorizontal: Spacing.five, borderRadius: Spacing.three },
});
