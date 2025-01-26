import type { Column, ColumnSizingState, Table, Updater } from "@tanstack/vue-table"
import type { ComputedRef, Ref } from "vue"
import { computed, readonly, ref, watch } from "vue"
import { type TableStorageManager, valueUpdater } from "../helpers"

export interface UseTableResizableReturn {
  columnSizingState: Ref<ColumnSizingState>
  onUpdateColumnSizingState: (updateOrValue: Updater<ColumnSizingState>) => void
}

export function useTableResizable<TData extends Record<string, any>>(
  table: Table<TData>,
  storage?: TableStorageManager,
): UseTableResizableReturn {
  const _columnSizeState = ref<ColumnSizingState>({})

  function init(table: Table<TData>): void {
    const allLeafColumns = table.getAllLeafColumns()
    allLeafColumns.forEach((col) => {
      _columnSizeState.value[col.id] = col.columnDef.size || 0
    })
  }

  // const watcher = watch(table, (table) => {
  //   if (table) {
  //     init(table)
  //     watcher()
  //   }
  // })
  init(table)

  return {
    columnSizingState: _columnSizeState,
    onUpdateColumnSizingState: (updateOrValue: Updater<ColumnSizingState>) => {
      valueUpdater(updateOrValue, _columnSizeState)
    },
  }
}
