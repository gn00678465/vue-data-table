import type { Column } from "@tanstack/vue-table"
import type { CSSProperties } from "vue"

export function getSize<TData extends Record<string, any>>(column: Column<TData>): CSSProperties {
  const { size, minSize, maxSize } = column.columnDef
  return Object.fromEntries(
    [["width", size], ["max-width", maxSize], ["min-width", minSize]]
      .filter(([, v]) => Boolean(v))
      .map(([k, v]) => [k, `${v}px`]),
  )
}
