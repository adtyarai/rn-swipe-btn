import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SwipeButton} from './components/SwipeButton';

const BACKGROUND = '#132223';
const ACCENT = '#dffc55';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <Text testID="status" style={styles.status}>
          {unlocked ? 'Unlocked' : 'Locked'}
        </Text>
        <SwipeButton
          testID="unlock-button"
          label="Swipe to unlock"
          onComplete={() => setUnlocked(true)}
          onReset={() => setUnlocked(false)}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  status: {
    color: ACCENT,
    fontSize: 20,
    fontWeight: '600',
  },
});
