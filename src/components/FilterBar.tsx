import { Input, Select } from './Controls';
import { ALL_CURRENCIES, ALL_STATUSES, type Currency, type TxStatus } from '../data/transactions';
import { useI18n } from '../i18n';

export interface FilterState {
  statuses: TxStatus[];
  currency: Currency | 'all';
  query: string;
}

interface FilterBarProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  const { t } = useI18n();

  const toggleStatus = (status: TxStatus) => {
    const statuses = value.statuses.includes(status)
      ? value.statuses.filter((s) => s !== status)
      : [...value.statuses, status];
    onChange({ ...value, statuses });
  };

  return (
    <div className="filter-bar">
      <div className="field">
        <label className="field__label" htmlFor="filter-search">
          {t.search}
        </label>
        <Input
          id="filter-search"
          className="field__input"
          type="search"
          placeholder={t.searchPlaceholder}
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="filter-currency">
          {t.filterCurrency}
        </label>
        <Select
          id="filter-currency"
          className="field__input"
          value={value.currency}
          onChange={(e) => onChange({ ...value, currency: e.target.value as Currency | 'all' })}
        >
          <option value="all">{t.allCurrencies}</option>
          {ALL_CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <fieldset className="field field--statuses">
        <legend className="field__label">{t.filterStatus}</legend>
        <div className="status-picks">
          {ALL_STATUSES.map((status) => (
            <label key={status} className="status-pick">
              <input
                type="checkbox"
                checked={value.statuses.includes(status)}
                onChange={() => toggleStatus(status)}
              />
              {t.status[status]}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
