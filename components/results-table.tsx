"use client";

import { useMemo, useState } from "react";

import { DocTypeBadge } from "./doc-type-badge";
import { ExportButtons } from "./export-buttons";
import type { DocType } from "@/lib/extraction-prompts";
import type { ExportPageSlice } from "@/lib/export-utils";
import type { HistoryPageSlice } from "@/lib/history-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResultsTableProps {
  type: DocType;
  fields: Record<string, string>;
  table?: string[][];
  pages?: HistoryPageSlice[];
}

function formatFieldName(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function cloneSlice(slice: HistoryPageSlice): HistoryPageSlice {
  return {
    fields: { ...slice.fields },
    table: slice.table?.map((row) => [...row]),
  };
}

function FieldsBlock({
  fields,
  onUpdateField,
}: {
  fields: Record<string, string>;
  onUpdateField: (key: string, value: string) => void;
}) {
  if (Object.keys(fields).length === 0) return null;
  return (
    <Card className="gap-0 py-0 ring-border">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-sm font-semibold">Extracted fields</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border px-0 py-0">
        {Object.entries(fields).map(([key, value]) => (
          <div
            key={key}
            className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <Label
              htmlFor={`field-${key}`}
              className="w-full shrink-0 text-sm font-medium text-muted-foreground sm:w-48"
            >
              {formatFieldName(key)}
            </Label>
            <Input
              id={`field-${key}`}
              value={value}
              onChange={(e) => onUpdateField(key, e.target.value)}
              className="h-9 flex-1"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TableBlock({
  table,
  onUpdateCell,
}: {
  table: string[][];
  onUpdateCell: (row: number, col: number, value: string) => void;
}) {
  if (table.length === 0) return null;
  const bodyRows = table.length > 1 ? table.slice(1) : [];

  const colWidths = useMemo(() => {
    const headers = table[0] ?? [];
    return headers.map((header, ci) => {
      let longest = header.length;
      for (const row of bodyRows) {
        const len = (row[ci] ?? "").length;
        if (len > longest) longest = len;
      }
      const ch = Math.max(6, Math.min(longest + 2, 40));
      return `${ch}ch`;
    });
  }, [table, bodyRows]);

  return (
    <Card className="gap-0 py-0 ring-border">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-sm font-semibold">Line items</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto px-0 pb-0 pt-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {table[0]?.map((header, i) => (
                <TableHead
                  key={i}
                  className="px-4 font-semibold whitespace-nowrap"
                  style={{ minWidth: colWidths[i] }}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bodyRows.map((row, ri) => (
              <TableRow key={ri}>
                {row.map((cell, ci) => (
                  <TableCell
                    key={ci}
                    className="px-4 py-2"
                    style={{ minWidth: colWidths[ci], maxWidth: "20rem" }}
                  >
                    <textarea
                      value={cell}
                      onChange={(e) => onUpdateCell(ri + 1, ci, e.target.value)}
                      rows={Math.max(1, Math.ceil(cell.length / 36))}
                      className="w-full resize-none border-0 bg-transparent px-1 text-sm shadow-none outline-none focus-visible:ring-0 dark:bg-transparent"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function ResultsTable({ type, fields: initialFields, table: initialTable, pages }: ResultsTableProps) {
  const usePages = pages && pages.length > 0;

  const [slices, setSlices] = useState<HistoryPageSlice[]>(() =>
    usePages ? pages.map(cloneSlice) : [{ fields: { ...initialFields }, table: initialTable?.map((r) => [...r]) }]
  );

  const [singleFields, setSingleFields] = useState(initialFields);
  const [singleTable, setSingleTable] = useState(initialTable);

  const exportSlices: ExportPageSlice[] = useMemo(() => {
    if (usePages) return slices.map((s) => ({ fields: s.fields, table: s.table }));
    return [{ fields: singleFields, table: singleTable }];
  }, [usePages, slices, singleFields, singleTable]);

  function updateField(key: string, value: string) {
    setSingleFields((prev) => ({ ...prev, [key]: value }));
  }

  function updateCell(row: number, col: number, value: string) {
    setSingleTable((prev) => {
      if (!prev) return prev;
      const next = prev.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });
  }

  function updateSliceField(sliceIndex: number, key: string, value: string) {
    setSlices((prev) => {
      const next = prev.map((s, i) =>
        i === sliceIndex ? { ...s, fields: { ...s.fields, [key]: value } } : s
      );
      return next;
    });
  }

  function updateSliceCell(sliceIndex: number, row: number, col: number, value: string) {
    setSlices((prev) => {
      const next = prev.map((s, i) => {
        if (i !== sliceIndex || !s.table) return s;
        const t = s.table.map((r) => [...r]);
        t[row][col] = value;
        return { ...s, table: t };
      });
      return next;
    });
  }

  return (
    <div className="animate-in space-y-6 fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DocTypeBadge type={type} />
        <ExportButtons
          fields={singleFields}
          table={singleTable}
          pageSlices={usePages ? exportSlices : undefined}
          docType={type}
          label={usePages && slices.length > 1 ? "All pages" : undefined}
        />
      </div>

      {usePages ? (
        <div className="space-y-10">
          {slices.map((slice, pageIndex) => (
            <section key={pageIndex} className="space-y-4 scroll-mt-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Page {pageIndex + 1}
                </h2>
                {slices.length > 1 && (
                  <ExportButtons
                    fields={slice.fields}
                    table={slice.table}
                    docType={type}
                    variant="compact"
                    label={`Page ${pageIndex + 1}`}
                  />
                )}
              </div>
              <FieldsBlock
                fields={slice.fields}
                onUpdateField={(key, v) => updateSliceField(pageIndex, key, v)}
              />
              {slice.table && slice.table.length > 0 && (
                <TableBlock
                  table={slice.table}
                  onUpdateCell={(row, col, v) => updateSliceCell(pageIndex, row, col, v)}
                />
              )}
            </section>
          ))}
        </div>
      ) : (
        <>
          <FieldsBlock fields={singleFields} onUpdateField={updateField} />
          {singleTable && singleTable.length > 0 && (
            <TableBlock table={singleTable} onUpdateCell={(row, col, v) => updateCell(row, col, v)} />
          )}
        </>
      )}
    </div>
  );
}
