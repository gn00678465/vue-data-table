import type { Table } from "@tanstack/vue-table"
import type { ComputedRef } from "vue"
import { readonly } from "vue"
import { TableStorageManager } from "../helpers"
import { useTableVisibility, type UseTableVisibilityReturn } from "./useTableVisibility"

export interface UseDataTableOptions {
  storage?: "cookie" | "sessionStorage" | "localStorage"
  tableId?: string
}

export interface UseDataTableReturn extends UseTableVisibilityReturn {

}

export function useDataTable<TData extends Record<string, any>>(
  tableInstance: ComputedRef<Table<TData> | undefined>,
  options: UseDataTableOptions = {},
): UseDataTableReturn {
  const { storage = undefined, tableId = "" } = options

  const storageManager = storage ? new TableStorageManager(storage, tableId) : undefined

  // 創建 visibility 功能模組
  const {
    columnVisibilityConfig,
    visibilityState,
    onUpdateVisibilityState,
    toggleAllColumnsVisible,
    isAllVisible,
    isSomeVisible,
  } = useTableVisibility(tableInstance, storageManager)

  return {
    // visibility
    columnVisibilityConfig,
    visibilityState: readonly(visibilityState),
    onUpdateVisibilityState,
    toggleAllColumnsVisible,
    isAllVisible,
    isSomeVisible,
  }
}
