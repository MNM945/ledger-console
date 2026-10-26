import { useI18n, type Locale } from '../i18n';
import { Select } from './Controls';

export function LanguageSwitch({ locale, onChange }: { locale: Locale; onChange: (next: Locale) => void }) {
  const { t } = useI18n();
  return (
    <div className="field field--inline">
      <label className="field__label" htmlFor="lang-switch">
        {t.language}
      </label>
      <Select id="lang-switch" value={locale} onValueChange={(value) => onChange(value as Locale)}>
        <option value="en">English</option>
        <option value="zh">简体中文</option>
        <option value="ar">العربية</option>
      </Select>
    </div>
  );
}
