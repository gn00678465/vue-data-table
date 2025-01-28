import type { Column, ColumnPinningPosition, ColumnPinningState, Table, Updater } from "@tanstack/vue-table"
import type { ComputedRef, CSSProperties, Ref } from "vue"
import type { DataTableColumns } from "../index.vue"
import { isRef, reactive, readonly, ref } from "vue"
import { columnsHandler, PersistentStorage, valueUpdater } from "../helpers"

export interface UseColumnPinningOptions {
  /**
   * 用於持久化存儲的鍵名
   * 如果不提供，則不會進行持久化
   */
  persistKey?: string
}

export interface UseColumnPinningReturn<TData extends Record<string, any>> {
  pinningState: Ref<ColumnPinningState>
  onUpdatePinningState: (updaterOrValue: Updater<ColumnPinningState>) => void
  getCommonPinningStyles: (column: Column<TData>) => CSSProperties
  buildPinningAPIs: (table: Table<TData>) => ColumnPinningAPIs
}

export interface ColumnPinningAPIs {
  setColumnPinning: (updater: Updater<ColumnPinningState>) => void
  resetColumnPinning: (defaultState?: boolean) => void
  getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
}

export function useColumnPinning<TData extends Record<string, any>>(
  columns: ComputedRef<DataTableColumns<TData>>,
  options: UseColumnPinningOptions = {},
): UseColumnPinningReturn<TData> {
  const { persistKey } = options
  const storage = PersistentStorage.getInstance()

  const _pinningState = persistKey
    ? storage.getState(persistKey, "pinningState", {})
    : ref<ColumnPinningState>({})

  function initialPinningState(): ColumnPinningState {
    const state: ColumnPinningState = {}
    if (isRef(columns)) {
      columnsHandler(columns.value, (col) => {
        if (!state?.left) {
          state.left = []
        }
        if (!state?.right) {
          state.right = []
        }
        if (col.meta?.fixed) {
          if (col.meta.fixed === "left" && col.id) {
            state.left.push(col.id)
          }
          if (col.meta.fixed === "right" && col.id) {
            state.right.unshift(col.id)
          }
        }
      })
    }

    return _pinningState.value = state
  }

  function buildPinningAPIs<TData extends Record<string, any>>(table: Table<TData>): ColumnPinningAPIs {
    return reactive({
      setColumnPinning: table.setColumnPinning,
      resetColumnPinning: table.resetColumnPinning,
      getIsSomeColumnsPinned: table.getIsSomeColumnsPinned,
    })
  }

  function getCommonPinningStyles(column: Column<TData>): CSSProperties {
    const isPinned = column.getIsPinned()
    return {
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      width: column.getSize(),
    }
  }

  if (!Object.keys(_pinningState.value).length) {
    initialPinningState()
  }

  return {
    pinningState: (readonly(_pinningState) as Ref<ColumnPinningState>),
    onUpdatePinningState: (updateOrValue: Updater<ColumnPinningState>) => {
      valueUpdater(updateOrValue, _pinningState)
    },
    getCommonPinningStyles,
    buildPinningAPIs,
  }
}
