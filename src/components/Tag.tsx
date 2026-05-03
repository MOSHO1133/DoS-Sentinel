import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

type Variant = 'red' | 'orange' | 'green' | 'blue' | 'purple';

const MAP: Record<Variant, { bg: string; color: string; border: string }> = {
  red:    { bg: C.redLight,    color: C.red,    border: C.redMid },
  orange: { bg: C.orangeLight, color: C.orange, border: '#FBD38D' },
  green:  { bg: C.greenLight,  color: C.green,  border: C.greenMid },
  blue:   { bg: C.blueLight,   color: C.blue,   border: C.blueMid },
  purple: { bg: C.purpleLight, color: C.purple, border: C.purpleMid },
};

interface Props { text: string; variant: Variant; }

export const Tag: React.FC<Props> = ({ text, variant }) => {
  const s = MAP[variant];
  return (
    <View style={[styles.tag, { backgroundColor: s.bg, borderColor: s.border }]}>
      <Text style={[styles.text, { color: s.color }]}>{text.toUpperCase()}</Text>
    </View>
  );
};

export function labelVariant(label: string): Variant {
  if (label === 'DoS' || label === 'DDoS') return 'red';
  if (label === 'Port Scanning')           return 'orange';
  if (label === 'Brute Force')             return 'purple';
  if (label === 'Normal Traffic')          return 'green';
  return 'blue';
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 3,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
});
