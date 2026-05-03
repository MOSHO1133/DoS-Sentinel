import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

interface Props {
  title: string;
  tag?: string;
  children: React.ReactNode;
  style?: any;
  bodyStyle?: any;
}

export const Panel: React.FC<Props> = ({ title, tag, children, style, bodyStyle }) => (
  <View style={[styles.panel, style]}>
    <View style={styles.header}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      {tag ? <Text style={styles.tag}>{tag}</Text> : null}
    </View>
    <View style={[styles.body, bodyStyle]}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  panel: {
    backgroundColor: C.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 12,
    overflow: 'hidden',
    ...C.shadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: C.surface2,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: C.text,
    letterSpacing: 0.6,
  },
  tag: {
    fontSize: 10,
    color: C.muted,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  body: { padding: 14 },
});
