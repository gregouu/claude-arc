import { useCallback, useRef } from 'react';
import { StyleSheet, View, Pressable, Platform } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { Arrow } from '@/types/scoring';

// 10 rings: index 0 = score 10 (innermost), index 9 = score 1 (outermost)
const RING_COLORS = [
  '#FFD600', // 10
  '#FFD600', // 9
  '#F44336', // 8
  '#F44336', // 7
  '#2196F3', // 6
  '#2196F3', // 5
  '#000000', // 4
  '#000000', // 3
  '#FFFFFF', // 2
  '#FFFFFF', // 1
];

const RING_BORDERS = [
  '#C6A700', '#C6A700',
  '#B71C1C', '#B71C1C',
  '#1565C0', '#1565C0',
  '#333', '#333',
  '#999', '#999',
];

interface TargetFaceProps {
  size: number;
  arrows: Arrow[];
  onPress: (x: number, y: number) => void;
}

export function TargetFace({ size, arrows, onPress }: TargetFaceProps) {
  const center = size / 2;
  const ringWidth = center / 10;
  const viewRef = useRef<View>(null);
  const layoutRef = useRef({ x: 0, y: 0 });

  const handleLayout = useCallback(() => {
    viewRef.current?.measureInWindow((x, y) => {
      layoutRef.current = { x, y };
    });
  }, []);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      const { pageX, pageY } = e.nativeEvent;
      const localX = pageX - layoutRef.current.x;
      const localY = pageY - layoutRef.current.y;
      const x = (localX - center) / center;
      const y = (localY - center) / center;
      onPress(x, y);
    },
    [center, onPress]
  );

  return (
    <View
      ref={viewRef}
      onLayout={handleLayout}
      style={[styles.container, { width: size, height: size }]}
    >
      <Pressable onPress={handlePress} style={StyleSheet.absoluteFill}>
        {/* Rings from outermost (score 1) to innermost (score 10) */}
        <View style={[styles.ringsContainer, { width: size, height: size }]} pointerEvents="none">
          {Array.from({ length: 10 }).map((_, i) => {
            const ringFromOutside = 9 - i;
            const color = RING_COLORS[ringFromOutside];
            const border = RING_BORDERS[ringFromOutside];
            const ringSize = (10 - i) * ringWidth * 2;
            return (
              <View
                key={i}
                style={[
                  styles.ring,
                  {
                    width: ringSize,
                    height: ringSize,
                    borderRadius: ringSize / 2,
                    backgroundColor: color,
                    borderColor: border,
                    borderWidth: 1,
                  },
                ]}
              />
            );
          })}

          {/* X marker - inner circle of the 10 */}
          <View style={[styles.xDot, {
            width: ringWidth,
            height: ringWidth,
            borderRadius: ringWidth / 2,
          }]} />
        </View>

        {/* Arrow impacts */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {arrows.map((arrow) => {
            const ax = center + arrow.x * center;
            const ay = center + arrow.y * center;
            return (
              <View
                key={arrow.id}
                style={[
                  styles.arrowDot,
                  { left: ax - 10, top: ay - 10 },
                ]}
              >
                <ThemedText style={styles.arrowLabel}>
                  {arrow.isX ? 'X' : arrow.score}
                </ThemedText>
              </View>
            );
          })}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    ...Platform.select({
      web: { cursor: 'crosshair' as any },
      default: {},
    }),
  },
  ringsContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  xDot: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#C6A700',
  },
  arrowDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00E676',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000',
    lineHeight: 12,
  },
});
