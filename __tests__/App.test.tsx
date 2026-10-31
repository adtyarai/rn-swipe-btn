import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import App from '../src/App';

describe('App', () => {
  it('shows the unlocked state after the button is activated', () => {
    render(<App />);
    expect(screen.getByTestId('status')).toHaveTextContent('Locked');

    fireEvent(screen.getByTestId('unlock-button'), 'accessibilityAction', {
      nativeEvent: {actionName: 'activate'},
    });

    expect(screen.getByTestId('status')).toHaveTextContent('Unlocked');
  });
});
