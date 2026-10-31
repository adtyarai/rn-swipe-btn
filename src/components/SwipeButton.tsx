import React, {useCallback} from 'react';
import {
  AccessibilityActionEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export type SwipeButtonColors = {
  track: string;
  fill: string;
  thumb: string;
  label: string;
  icon: string;
};

export type SwipeButtonProps = {
  /** Text shown on the track; also used as the accessibility label. */
  label?: string;
  /** Called once when the thumb is released past the threshold. */
  onComplete?: () => void;
  /** Called when a completed button is swiped (or toggled) back to the start. */
  onReset?: () => void;
  width?: number;
  height?: number;
  /** Fraction of the track (0-1) the thumb must pass to complete. */
  completionThreshold?: number;
  disabled?: boolean;
  colors?: Partial<SwipeButtonColors>;
  thumbIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const DEFAULT_COLORS: SwipeButtonColors = {
  track: '#253836',
  fill: '#132223',
  thumb: '#dffc55',
  label: '#dffc55',
  icon: '#132223',
};

const SPRING_CONFIG = {damping: 18, stiffness: 180};

/**
 * A "swipe to confirm" button. The drag and snap animations run entirely on the
 * UI thread (Reanimated worklets); React is only notified when the completed
 * state actually changes.
 *
 * Screen-reader users can't perform the swipe, so the same toggle is exposed as
 * the "activate" accessibility action (double-tap with VoiceOver/TalkBack).
 */
export function SwipeButton({
  label = 'Swipe to confirm',
  onComplete,
  onReset,
  width = 320,
  height = 56,
  completionThreshold = 0.5,
  disabled = false,
  colors,
  thumbIcon,
  style,
  testID,
}: SwipeButtonProps) {
  const palette = {...DEFAULT_COLORS, ...colors};
  const thumbSize = height;
  const maxTranslate = width - thumbSize;

  const translateX = useSharedValue(0);
  const dragStartX = useSharedValue(0);
  const completed = useSharedValue(false);

  const notify = useCallback(
    (isComplete: boolean) => {
      if (isComplete) {
        onComplete?.();
      } else {
        onReset?.();
      }
    },
    [onComplete, onReset],
  );

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .onBegin(() => {
      // Start from wherever the thumb is now, including mid-spring.
      dragStartX.value = translateX.value;
    })
    .onUpdate(event => {
      // Clamp rather than ignore out-of-range values so fast swipes still reach the ends.
      translateX.value = Math.min(
        Math.max(dragStartX.value + event.translationX, 0),
        maxTranslate,
      );
    })
    .onEnd(() => {
      const shouldComplete =
        translateX.value >= maxTranslate * completionThreshold;
      translateX.value = withSpring(
        shouldComplete ? maxTranslate : 0,
        SPRING_CONFIG,
      );
      if (shouldComplete !== completed.value) {
        completed.value = shouldComplete;
        runOnJS(notify)(shouldComplete);
      }
    });

  const handleAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (disabled || event.nativeEvent.actionName !== 'activate') {
      return;
    }
    const next = !completed.value;
    completed.value = next;
    translateX.value = withSpring(next ? maxTranslate : 0, SPRING_CONFIG);
    notify(next);
  };

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: translateX.value + thumbSize / 2,
  }));

  const labelStyle = useAnimatedStyle(() => {
    const halfway = maxTranslate / 2;
    return {
      opacity: interpolate(
        translateX.value,
        [0, halfway],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateX: interpolate(
            translateX.value,
            [0, halfway],
            [0, halfway / 2],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const radius = height / 2;

  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Swipe right, or double-tap, to confirm"
      accessibilityState={{disabled}}
      accessibilityActions={[{name: 'activate', label}]}
      onAccessibilityAction={handleAccessibilityAction}
      style={[
        styles.track,
        {width, height, borderRadius: radius, backgroundColor: palette.track},
        disabled && styles.disabled,
        style,
      ]}>
      <Animated.View
        style={[
          styles.fill,
          {height, borderRadius: radius, backgroundColor: palette.fill},
          fillStyle,
        ]}
      />
      <Animated.Text
        numberOfLines={1}
        style={[styles.label, {color: palette.label}, labelStyle]}>
        {label}
      </Animated.Text>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: radius,
              backgroundColor: palette.thumb,
            },
            thumbStyle,
          ]}>
          {thumbIcon ?? (
            <Text style={[styles.icon, {color: palette.icon}]}>{'»'}</Text>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  thumb: {
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
