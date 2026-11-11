'use client';

import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu';

import { filterTriggerStyles } from './filter-trigger';

interface FacetOption<TValue extends string> {
  value: TValue;
  label: string;
}

interface FacetFilterProps<TValue extends string> {
  label: string;
  icon?: ReactNode;
  options: readonly FacetOption<TValue>[];
  selected: readonly TValue[];
  onChange: (selected: TValue[]) => void;
  /** Tick several options (checkboxes) instead of picking one (radios). */
  isMultiple?: boolean;
  /** Single-choice only: adds a first option that clears the filter. */
  allLabel?: string;
}

const ALL = '';

function summary<TValue extends string>({
  label,
  options,
  selected,
}: Pick<FacetFilterProps<TValue>, 'label' | 'options' | 'selected'>) {
  if (selected.length === 0) return label;
  if (selected.length > 1) return `${label} · ${String(selected.length)}`;
  return options.find((option) => option.value === selected[0])?.label ?? label;
}

function Choices<TValue extends string>({
  options,
  selected,
  onChange,
  isMultiple,
  allLabel,
}: FacetFilterProps<TValue>) {
  if (isMultiple) {
    const checkboxes = options.map((option) => (
      <MenuCheckboxItem
        key={option.value}
        checked={selected.includes(option.value)}
        onCheckedChange={(checked) =>
          onChange(
            checked
              ? [...selected, option.value]
              : selected.filter((value) => value !== option.value),
          )
        }
      >
        {option.label}
      </MenuCheckboxItem>
    ));
    if (selected.length === 0) return checkboxes;
    return (
      <>
        {checkboxes}
        <MenuSeparator />
        <MenuItem onClick={() => onChange([])}>Clear selection</MenuItem>
      </>
    );
  }
  return (
    <MenuRadioGroup
      value={selected[0] ?? ALL}
      onValueChange={(next) =>
        onChange(options.filter((option) => option.value === next).map((option) => option.value))
      }
    >
      {allLabel && <MenuRadioItem value={ALL}>{allLabel}</MenuRadioItem>}
      {options.map((option) => (
        <MenuRadioItem key={option.value} value={option.value}>
          {option.label}
        </MenuRadioItem>
      ))}
    </MenuRadioGroup>
  );
}

/**
 * A filter pill that opens a list of options.
 * @example <FacetFilter label="Condition" isMultiple options={CONDITIONS} selected={filters.condition} onChange={setCondition} />
 */
export function FacetFilter<TValue extends string>(props: FacetFilterProps<TValue>) {
  const isActive = props.selected.length > 0 && Boolean(props.allLabel ?? props.isMultiple);

  return (
    <Menu>
      <MenuTrigger className={filterTriggerStyles({ isActive })}>
        {props.icon}
        {summary(props)}
        <ChevronDown className="opacity-60" aria-hidden />
      </MenuTrigger>
      <MenuContent align="start">
        <Choices {...props} />
      </MenuContent>
    </Menu>
  );
}
