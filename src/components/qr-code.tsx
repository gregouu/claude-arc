import { View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';

interface QRCodeProps {
  data: string;
  size?: number;
}

function generateMatrix(data: string): boolean[][] {
  const moduleCount = 21; // Version 1 QR = 21x21
  const matrix: boolean[][] = Array.from({ length: moduleCount }, () =>
    Array(moduleCount).fill(false)
  );

  // Finder patterns (3 corners)
  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[row + r][col + c] = isOuter || isInner;
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, 14);
  drawFinder(14, 0);

  // Timing patterns
  for (let i = 8; i < 13; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Separators (already false by default)

  // Data encoding (simplified - deterministic from string)
  let bitIndex = 0;
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i);
    for (let bit = 7; bit >= 0; bit--) {
      const val = (charCode >> bit) & 1;
      // Place in available cells (skip finder/timing areas)
      let placed = false;
      while (!placed && bitIndex < moduleCount * moduleCount) {
        const r = Math.floor(bitIndex / moduleCount);
        const c = bitIndex % moduleCount;
        bitIndex++;

        // Skip finder pattern areas
        const inFinder =
          (r < 8 && c < 8) ||
          (r < 8 && c >= 13) ||
          (r >= 13 && c < 8);
        // Skip timing
        const inTiming = r === 6 || c === 6;

        if (!inFinder && !inTiming) {
          matrix[r][c] = val === 1;
          placed = true;
        }
      }
    }
  }

  return matrix;
}

export function QRCode({ data, size = 180 }: QRCodeProps) {
  const matrix = generateMatrix(data);
  const moduleCount = matrix.length;
  const cellSize = size / moduleCount;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { width: size + 16, height: size + 16 }]}>
        <View style={[styles.inner, { width: size, height: size }]}>
          {matrix.map((row, ri) =>
            row.map((cell, ci) =>
              cell ? (
                <View
                  key={`${ri}-${ci}`}
                  style={{
                    position: 'absolute',
                    left: ci * cellSize,
                    top: ri * cellSize,
                    width: cellSize + 0.5,
                    height: cellSize + 0.5,
                    backgroundColor: '#000',
                  }}
                />
              ) : null
            )
          )}
        </View>
      </View>
      <ThemedText type="small" style={styles.hint}>Scanner au greffe</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'center', alignItems: 'center', gap: 8 },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: { position: 'relative' },
  hint: { textAlign: 'center' },
});
