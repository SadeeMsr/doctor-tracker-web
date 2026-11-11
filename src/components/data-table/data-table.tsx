'use client';

import { createColumnHelper, tableFeatures, useTable, type RowData } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface DataTableColumn<TData> {
  id: string;
  header: string;
  cell: (row: TData) => ReactNode;
  /** Applied to the header and every cell of the column, e.g. `text-right`. */
  className?: string;
}

interface DataTableProps<TData> {
  /** Read by screen readers as the table's name. */
  caption: string;
  columns: DataTableColumn<TData>[];
  data: TData[];
  getRowId: (row: TData) => string;
  /** Phones get stacked cards instead of a sideways-scrolling table. */
  renderCard: (row: TData) => ReactNode;
  /** Dims the rows while the next page is on its way. */
  isStale?: boolean;
}

const features = tableFeatures({});

function DesktopTable<TData extends RowData>({
  caption,
  columns,
  data,
  getRowId,
}: Omit<DataTableProps<TData>, 'renderCard' | 'isStale'>) {
  const helper = createColumnHelper<typeof features, TData>();
  const classNames = new Map(columns.map((column) => [column.id, column.className]));
  const table = useTable({
    features,
    data,
    getRowId,
    columns: columns.map((column) =>
      helper.display({
        id: column.id,
        header: column.header,
        cell: ({ row }) => column.cell(row.original),
      }),
    ),
  });

  return (
    <table className="w-full text-left text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead className="font-mono text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id}>
            {group.headers.map((header) => (
              <th
                key={header.id}
                scope="col"
                className={cn('px-5 py-4 font-medium', classNames.get(header.column.id))}
              >
                <table.FlexRender header={header} />
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="border-t transition-colors hover:bg-canvas-soft/60">
            {row.getAllCells().map((cell) => (
              <td key={cell.id} className={cn('px-5 py-3.5', classNames.get(cell.column.id))}>
                <table.FlexRender cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Server-paginated table (TanStack Table) that turns into cards below `md`.
 * @example <DataTable caption="Doctors" columns={columns} data={rows} getRowId={(row) => row.id} renderCard={(row) => <DoctorCard doctor={row} />} />
 */
export function DataTable<TData extends RowData>({
  renderCard,
  isStale = false,
  ...table
}: DataTableProps<TData>) {
  return (
    <div className={cn('transition-opacity duration-200', isStale && 'opacity-60')}>
      <div className="hidden overflow-hidden rounded-3xl bg-surface ring-1 ring-border md:block">
        <DesktopTable {...table} />
      </div>
      <ul className="grid gap-3 md:hidden">
        {table.data.map((row) => (
          <li key={table.getRowId(row)}>{renderCard(row)}</li>
        ))}
      </ul>
    </div>
  );
}
