import { Button } from './Controls';
import { useI18n } from '../i18n';

export type Theme = 'dark' | 'light';

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const { t } = useI18n();
  return (
    <Button className="btn theme-toggle" onClick={onToggle} aria-label={t.themeToggle} aria-pressed={theme === 'dark'}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {theme === 'dark' ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z" />}
      </svg>
      <span>{theme === 'dark' ? t.lightMode : t.darkMode}</span>
    </Button>
  );
}
