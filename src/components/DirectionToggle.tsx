import { Button } from './Controls';
import { useI18n, type Direction, type Locale } from '../i18n';

interface DirectionToggleProps {
  direction: Direction;
  onToggle: () => void;
}

export function DirectionToggle({ direction, onToggle }: DirectionToggleProps) {
  const { t } = useI18n();
  return (
    <Button type="button" className="btn" onClick={onToggle} aria-pressed={direction === 'rtl'}>
      {direction === 'rtl' ? t.directionToggleBack : t.directionToggle}
    </Button>
  );
}

export function LanguageSwitch({ locale, onChange }: { locale: Locale; onChange: (next: Locale) => void }) {
  const { t } = useI18n();
  return (
    <div className="field field--inline">
      <label className="field__label" htmlFor="lang-switch">
        {t.language}
      </label>
      <select id="lang-switch" className="field__input" value={locale} onChange={(e) => onChange(e.target.value as Locale)}>
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}
