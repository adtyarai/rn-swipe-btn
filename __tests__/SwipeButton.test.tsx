import React from 'react';
import {Text} from 'react-native';
import {fireEvent, render, screen} from '@testing-library/react-native';
import {SwipeButton} from '../src/components/SwipeButton';

const activate = (element: Parameters<typeof fireEvent>[0]) =>
  fireEvent(element, 'accessibilityAction', {
    nativeEvent: {actionName: 'activate'},
  });

describe('SwipeButton', () => {
  it('renders its label and exposes it to screen readers', () => {
    render(<SwipeButton label="Swipe to pay" />);

    expect(screen.getByText('Swipe to pay')).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Swipe to pay'})).toBeTruthy();
  });

  it('completes and then resets via the accessibility action', () => {
    const onComplete = jest.fn();
    const onReset = jest.fn();
    render(
      <SwipeButton label="Confirm" onComplete={onComplete} onReset={onReset} />,
    );
    const button = screen.getByRole('button', {name: 'Confirm'});

    activate(button);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onReset).not.toHaveBeenCalled();

    activate(button);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('ignores the accessibility action when disabled', () => {
    const onComplete = jest.fn();
    render(<SwipeButton label="Confirm" disabled onComplete={onComplete} />);

    activate(screen.getByRole('button', {name: 'Confirm'}));

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('renders a custom thumb icon instead of the default', () => {
    render(<SwipeButton thumbIcon={<Text>→</Text>} />);

    expect(screen.getByText('→')).toBeTruthy();
    expect(screen.queryByText('»')).toBeNull();
  });
});
