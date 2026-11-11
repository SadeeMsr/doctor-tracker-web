import { Badge } from '@/components/ui/badge';

import { CONDITION_META, type Condition } from '@/lib/conditions';

/** A patient's condition: coloured dot plus the word, never colour alone. */
export function ConditionBadge({ condition }: { condition: Condition }) {
  const { label, tone } = CONDITION_META[condition];
  return (
    <Badge tone={tone} hasDot>
      {label}
    </Badge>
  );
}
