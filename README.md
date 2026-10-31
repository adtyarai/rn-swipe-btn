# rn-swipe-btn

A "swipe to unlock" button for React Native, built with **Reanimated 3** and **React Native Gesture Handler**. The animation runs on the UI thread, so the drag stays smooth regardless of JS-thread load.

## What it shows

- A draggable thumb driven by a `PanGestureHandler`, with position held in a Reanimated shared value
- Snap-to-end behaviour on release using `withSpring`: past the halfway point it completes, otherwise it springs back
- Three animated styles driven by one shared value:
  - the thumb's horizontal translation
  - a fill overlay that grows behind the thumb
  - the "Swipe to unlock" label fading and sliding out (`interpolate` with clamping)
- Completion state passed back to React with `runOnJS`
- Swiping back from the completed state to reset it

## Tech stack

- React Native 0.72
- React 18
- react-native-reanimated 3
- react-native-gesture-handler 2

## Running locally

**Prerequisites:** Node 16+, plus the [React Native environment setup](https://reactnative.dev/docs/environment-setup) for Android and/or iOS.

```
npm install

# iOS only
cd ios && bundle install && bundle exec pod install && cd ..

npm run android   # or: npm run ios
```

## Code

All of the component logic is in [`src/App.js`](src/App.js). Dimensions and colours are constants at the top of the file; the thumb's travel distance is derived from them (`MAX_TRANSLATE`), so resizing the button only takes changing `BUTTON_WIDTH`.

## Notes

This is an animation exercise, not a published package — the button lives inside the demo `App` rather than as a standalone component with props. Natural next steps would be extracting it into a reusable `<SwipeButton onComplete={...} />` and migrating from `useAnimatedGestureHandler` (deprecated in Reanimated 3) to the Gesture Handler 2 `Gesture.Pan()` API.
