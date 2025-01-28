import type { ColumnDef } from "@tanstack/vue-table"
import type { DataTableColumns } from "../index.vue"

const processed = new WeakSet<ColumnDef<any>>()

export function columnsHandler<TData extends Record<string, any>>(
  columns?: DataTableColumns<TData>,
  handler: (col: ColumnDef<TData>) => void = () => {},
): void {
  if (!columns)
    return

  const queue = [...columns]

  while (queue.length > 0) {
    const current = queue.shift()!
    if (processed.has(current))
      continue

    // 处理当前列
    handler(current)
    processed.add(current)

    // 将子列加入队列
    if ("columns" in current && Array.isArray(current.columns)) {
      queue.push(...current.columns)
    }
  }
}
