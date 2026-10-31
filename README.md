# rn-swipe-btn

[![CI](https://github.com/adtyarai/rn-swipe-btn/actions/workflows/ci.yml/badge.svg)](https://github.com/adtyarai/rn-swipe-btn/actions/workflows/ci.yml)

A reusable, typed **swipe-to-confirm button** for React Native, built with **Reanimated 3** and **React Native Gesture Handler 2**. The drag and snap animations run entirely on the UI thread, so the button stays smooth even when the JS thread is busy.

## Usage

```tsx
import {SwipeButton} from './src/components/SwipeButton';

<SwipeButton
  label="Swipe to pay"
  onComplete={() => submitPayment()}
  onReset={() => cancelPayment()}
/>;
```

The demo app in [`src/App.tsx`](src/App.tsx) toggles a Locked / Unlocked status.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `"Swipe to confirm"` | Track text; also the accessibility label |
| `onComplete` | `() => void` | | Called when released past the threshold |
| `onReset` | `() => void` | | Called when a completed button is swiped back |
| `width` | `number` | `320` | Track width |
| `height` | `number` | `56` | Track height; the thumb is a circle of this size |
| `completionThreshold` | `number` | `0.5` | Fraction of the track the thumb must pass |
| `disabled` | `boolean` | `false` | Disables the gesture and dims the button |
| `colors` | `Partial<SwipeButtonColors>` | dark/lime theme | `track`, `fill`, `thumb`, `label`, `icon` |
| `thumbIcon` | `ReactNode` | `»` | Custom thumb content |
| `style` | `StyleProp<ViewStyle>` | | Extra container styles |

## How it works

- **One shared value drives everything.** `translateX` moves the thumb, grows the fill behind it, and fades and slides the label out via `interpolate`.
- **`Gesture.Pan()`** (the Gesture Handler 2 API) handles the drag. Each drag starts from the thumb's current position, even mid-animation, and the position is clamped to the track, so fast swipes still reach the ends.
- **On release**, the thumb springs to whichever end is closer. React is notified via `runOnJS` only when the completed state actually changes, so there are no needless re-renders while dragging.
- **Accessibility:** screen-reader users can't perform the swipe gesture, so the same toggle is exposed as the `activate` accessibility action (double-tap with VoiceOver or TalkBack), with a role, label, hint and disabled state.

## Running the demo

**Prerequisites:** Node 18+ and the [React Native environment setup](https://reactnative.dev/docs/environment-setup) for Android and/or iOS.

```bash
npm install

# iOS only
cd ios && bundle install && bundle exec pod install && cd ..

npm run android   # or: npm run ios
```

## Checks

```bash
npm run lint        # ESLint + Prettier
npm run typecheck   # TypeScript
npm test            # Jest + React Native Testing Library
```

Tests cover rendering, the accessibility toggle (complete, then reset), the disabled state, a custom thumb icon, and the demo app's state change. CI runs all three checks on every push and pull request.

## Project structure

```
src/
├── App.tsx                    Demo screen
└── components/
    └── SwipeButton.tsx        The reusable component
__tests__/                     Component and app tests
```

## Tech stack

React Native 0.72 · TypeScript · Reanimated 3 · Gesture Handler 2 · Jest · React Native Testing Library · GitHub Actions
