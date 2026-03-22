"use client";

import { useState } from "react";
import { DocTypeBadge } from "./doc-type-badge";
import { ExportButtons } from "./export-buttons";
import type { DocType } from "@/lib/extraction-prompts";

interface ResultsTableProps {
  type: DocType;
  fields: Record<string, string>;
  table?: string[][];
}

function formatFieldName(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ResultsTable({ type, fields: initialFields, table: initialTable }: ResultsTableProps) {
  const [fields, setFields] = useState(initialFields);
  const [table, setTable] = useState(initialTable);

  const updateField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const updateCell = (row: number, col: number, value: string) => {
    setTable((prev) => {
      if (!prev) return prev;
      const next = prev.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <DocTypeBadge type={type} />
        <ExportButtons fields={fields} table={table} docType={type} />
      </div>

      {/* Key-Value Fields */}
      {Object.keys(fields).length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Extracted Fields
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {Object.entries(fields).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-48 shrink-0">
                  {formatFieldName(key)}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table Data */}
      {table && table.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Line Items
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/30">
                  {table[0]?.map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {table.slice(1).map((row, ri) => (
                  <tr key={ri} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => updateCell(ri + 1, ci, e.target.value)}
                          className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
