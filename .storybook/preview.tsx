import type { Preview } from '@storybook/react-vite';
import { useEffect, type ReactNode } from 'react';
import '../src/styles/tokens.css';
import '../src/styles/themes.css';
import '../src/styles/global.css';

function ThemePreview({ theme, children }: { theme: string; children: ReactNode }) {
  useEffect(() => {
    const previous = document.documentElement.dataset.theme;
    document.documentElement.dataset.theme = theme;
    return () => {
      if (previous === undefined) delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = previous;
    };
  }, [theme]);
  return <>{children}</>;
}

const preview: Preview = {
  globalTypes: {
    theme: { description: 'Semantic color mode', toolbar: { icon: 'circlehollow', items: ['dark', 'light'], dynamicTitle: true } },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [(Story, context) => <ThemePreview theme={context.globals.theme === 'light' ? 'light' : 'dark'}><Story /></ThemePreview>],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
