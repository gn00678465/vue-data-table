import type { Column, ColumnDef, ColumnHelper, Updater, VisibilityState } from "@tanstack/vue-table"
import { computed, type ComputedRef, reactive, ref } from "vue"
import { valueUpdater } from "./valueUpdater"

interface ColumnState {
  visibility: VisibilityState
}

interface UseColumnStatesOption {}

export function useColumnStates<TData extends Record<string, any>>(): UseColumnStatesReturn<TData> {
  const columnStates: ColumnState = reactive({
    visibility: { },
  })

  function initialColumnStates(): void {
  }

  function toggleColumnVisibility(column: Column<TData>): void {
    columnStates.visibility = {
      ...columnStates.visibility,
      [column.id]: !column.getIsVisible(),
    }
  }

  return {
    columnVisibility: computed(() => columnStates.visibility),
    toggleColumnVisibility,
  }
}

export interface UseColumnStatesReturn<TData extends Record<string, any>> {
  columnVisibility: ComputedRef<VisibilityState>
  toggleColumnVisibility: (column: Column<TData>) => void
}
