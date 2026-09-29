import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type HeaderAction = {
  icon?: ReactNode;
  label?: string;
  accessibilityLabel?: string;
  onPress: () => void;
};

export type AppHeaderProps = {
  title?: string;
  onBack?: () => void;
  actions?: HeaderAction[];
  onOverflowPress?: () => void;
};

export function AppHeader({ title, onBack, actions = [], onOverflowPress }: AppHeaderProps) {
  if (actions.length > 2 && !onOverflowPress) {
    throw new Error('AppHeader requires onOverflowPress when more than two actions are supplied.');
  }
  actions.forEach((action) => {
    if (!action.label && !action.icon) {
      throw new Error('Every AppHeader action requires an icon, a label, or both.');
    }
    if (!action.label && !action.accessibilityLabel) {
      throw new Error('Icon-only AppHeader actions require an accessibilityLabel.');
    }
  });

  const visibleActions = actions.slice(0, 2);
  const hasOverflow = actions.length > 2;

  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      ) : null}

      {title ? (
        <Text accessibilityRole="header" numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {title}
        </Text>
      ) : actions.length > 0 ? <View style={styles.spacer} /> : null}

      {visibleActions.map((action, index) => (
        <Pressable
          key={action.label ?? `header-action-${index}`}
          accessibilityRole="button"
          accessibilityLabel={action.accessibilityLabel ?? action.label}
          hitSlop={6}
          onPress={action.onPress}
          style={styles.actionButton}
        >
          {action.icon}
          {action.label ? (
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.actionLabel}>
              {action.label}
            </Text>
          ) : null}
        </Pressable>
      ))}

      {hasOverflow ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mais ações"
          hitSlop={6}
          onPress={onOverflowPress}
          style={styles.overflowButton}
        >
          <Text style={styles.overflowLabel}>...</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4
  },
  title: {
    flex: 1,
    flexShrink: 1,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: '#101828'
  },
  spacer: {
    flex: 1
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 4
  },
  backIcon: {
    fontSize: 32,
    lineHeight: 36,
    color: '#101828'
  },
  actionButton: {
    minWidth: 42,
    minHeight: 42,
    maxWidth: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginLeft: 4,
    paddingHorizontal: 6
  },
  actionLabel: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#344054'
  },
  overflowButton: {
    minWidth: 42,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4
  },
  overflowLabel: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: '#344054'
  }
});
