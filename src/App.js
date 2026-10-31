import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const COLORS = {
  SLIDE_BTN: '#dffc55',
  BTN_COLOR: '#253836',
  BG_COLOR: '#132223',
};

const BUTTON_HEIGHT = 50;
const BUTTON_WIDTH = 350;
const BORDER_RADIUS = 50;
const SWIPE_BUTTON_WIDTH = 50;
// Furthest the thumb can travel: track width minus thumb width
const MAX_TRANSLATE = BUTTON_WIDTH - SWIPE_BUTTON_WIDTH;

export default function App() {
  const X = useSharedValue(0);
  const [toggled, setToggled] = React.useState(false);

  const handleComplete = isToggled => {
    if (isToggled !== toggled) {
      setToggled(isToggled);
    }
  };

  const handleGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.completed = toggled;
    },
    onActive: (event, context) => {
      const start = context.completed ? MAX_TRANSLATE : 0;
      // Clamp instead of ignoring out-of-range values, so fast swipes still reach the ends
      X.value = Math.min(Math.max(start + event.translationX, 0), MAX_TRANSLATE);
    },
    onEnd: () => {
      const completed = X.value >= MAX_TRANSLATE / 2;
      X.value = withSpring(completed ? MAX_TRANSLATE : 0);
      runOnJS(handleComplete)(completed);
    },
  });

  const AnimatedStyles = {
    swipeStyles: useAnimatedStyle(() => {
      return {
        transform: [{translateX: X.value}],
      };
    }),
    swipeText: useAnimatedStyle(() => {
      return {
        opacity: interpolate(X.value, [0, 150], [1, 0], Extrapolate.CLAMP),
        transform: [
          {
            translateX: interpolate(
              X.value,
              [0, 150],
              [0, BUTTON_WIDTH / 2 - SWIPE_BUTTON_WIDTH],
            ),
          },
        ],
      };
    }),
    overlayView: useAnimatedStyle(() => {
      return {
        width: X.value + SWIPE_BUTTON_WIDTH / 2,
      };
    }),
  };
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <View
          style={{
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
            backgroundColor: COLORS.BTN_COLOR,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: BORDER_RADIUS,
          }}>
          <Animated.View
            style={[
              {
                width: 0,
                height: BUTTON_HEIGHT,
                backgroundColor: COLORS.BG_COLOR,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: BORDER_RADIUS,
                position: 'absolute',
                left: 0,
              },
              AnimatedStyles.overlayView,
            ]}
          />
          <PanGestureHandler onGestureEvent={handleGestureEvent}>
            <Animated.View
              style={[
                {
                  height: BUTTON_HEIGHT,
                  width: SWIPE_BUTTON_WIDTH,
                  backgroundColor: COLORS.SLIDE_BTN,
                  position: 'absolute',
                  left: 0,
                  borderRadius: BORDER_RADIUS,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                AnimatedStyles.swipeStyles,
              ]}>
              <Text>{'>>>'}</Text>
            </Animated.View>
          </PanGestureHandler>
          <Animated.Text
            style={[{color: COLORS.SLIDE_BTN}, AnimatedStyles.swipeText]}>
            Swipe to unlock
          </Animated.Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
