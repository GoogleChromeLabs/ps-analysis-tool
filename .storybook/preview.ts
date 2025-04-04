/**
 * External dependencies.
 */
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import 'tailwindcss/tailwind.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
    parentSelector: 'body',
  }),
];
