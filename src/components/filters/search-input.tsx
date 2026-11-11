'use client';

import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Accessible name; also used as the placeholder. */
  label: string;
  className?: string;
}

/**
 * Controlled search box with a clear button. The owner debounces what it does with the value.
 * @example <SearchInput label="Search doctors" value={filters.q} onChange={setSearch} />
 */
export function SearchInput({ value, onChange, label, className }: SearchInputProps) {
  return (
    <Input
      type="search"
      inputMode="search"
      enterKeyHint="search"
      aria-label={label}
      placeholder={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      icon={<Search />}
      className={className}
      inputClassName="[&::-webkit-search-cancel-button]:hidden"
      trailing={
        value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>
        )
      }
    />
  );
}
