import type { Table } from "@tanstack/vue-table"

export function initialDevMode<TData extends Record<string, any>>(table: Table<TData>): void {
  if (import.meta.env.DEV) {
    table.setOptions((old) => {
      return { ...old, debugTable: true, debugHeaders: true, debugColumns: true }
    })
  }
}
