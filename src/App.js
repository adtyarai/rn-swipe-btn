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
  ARROW_COLOR: '#00000',
};

const BUTTON_HEIGHT = 50;
const BUTTON_WIDTH = 350;
const BORDER_RADIUS = 50;
const SWIPE_BUTTON_WIDTH = 50;

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
      let newValue;
      if (context.completed) {
        newValue = 290 + event.translationX;
      } else {
        newValue = event.translationX;
      }

      if (newValue >= 0 && newValue <= 300) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      if (X.value < BUTTON_WIDTH / 2) {
        X.value = withSpring(0);
      } else X.value = withSpring(300);
      runOnJS(handleComplete)(true);
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
      {console.log('Xvalue')}
      {console.log(X.value)}
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
                  width: 50,
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
