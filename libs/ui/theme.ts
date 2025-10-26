import { createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e3f2ff' },
          100: { value: '#b8daff' },
          200: { value: '#8cc2ff' },
          300: { value: '#5fa9ff' },
          400: { value: '#3391ff' },
          500: { value: '#0678ff' }, // Primary brand color
          600: { value: '#0560cc' },
          700: { value: '#044999' },
          800: { value: '#023166' },
          900: { value: '#011a33' },
        },
        dark: {
          bg: { value: '#0a0a0a' },
          surface: { value: '#1a1a1a' },
          border: { value: '#2a2a2a' },
        },
      },
      fonts: {
        heading: { value: `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` },
        body: { value: `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` },
        mono: { value: `'Geist Mono', 'Menlo', 'Monaco', 'Courier New', monospace` },
      },
    },
    semanticTokens: {
      colors: {
        'text.primary': {
          value: { base: '{colors.gray.800}', _dark: '{colors.gray.100}' },
        },
        'text.secondary': {
          value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' },
        },
        'bg.primary': {
          value: { base: 'white', _dark: '{colors.dark.surface}' },
        },
        'bg.secondary': {
          value: { base: '{colors.gray.50}', _dark: '{colors.dark.bg}' },
        },
        'border.color': {
          value: { base: '{colors.gray.200}', _dark: '{colors.dark.border}' },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: 'bg.secondary',
      color: 'text.primary',
    },
  },
});

export default system;
