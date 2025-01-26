import type { Column, Table, Updater, VisibilityState } from "@tanstack/vue-table"
import type { ComputedRef, MaybeRef, Ref } from "vue"
import { computed, readonly, ref, toValue, watch } from "vue"
import { TableStorageManager } from "./storage"
import { valueUpdater } from "./valueUpdater"

export interface UseDataTableOptions {
  storage?: "cookie" | "sessionStorage" | "localStorage"
  storageKey?: string
}

export interface UseDataTableReturn {
  visibilityState: Ref<VisibilityState>
  onUpdateVisibilityState: (updateOrValue: Updater<VisibilityState>) => void
  columnVisibilityConfig: ComputedRef<columnVisibilityConfig>
}

export function useDataTable<TData extends Record<string, any>>(
  dataTableRef: MaybeRef<{ tableInstance: Table<TData> } | undefined>,
  options: UseDataTableOptions = {},
): UseDataTableReturn {
  const { storage = undefined, storageKey = "" } = options

  const storageManager = storage ? new TableStorageManager(storage, storageKey) : undefined

  /** all leaf columns */
  const allLeafColumns = computed(() => toValue(dataTableRef)?.tableInstance.getAllLeafColumns() || [])

  /**
   * visibility state config
   */
  const _visibilityState = ref<VisibilityState>({})
  function buildVisibilityConfig(column: Column<TData>): ColumnVisibility {
    return {
      key: column.id,
      visibility: column.getIsVisible(),
      disabled: !column.getCanHide(),
      onChange: column.getToggleVisibilityHandler(),
    }
  }
  const columnVisibilityConfig = computed<columnVisibilityConfig>(() => allLeafColumns.value.map(buildVisibilityConfig))

  // 初始化
  async function initialize(): Promise<void> {
    const state = await storageManager?.getState()
    if (state && state.features.visibility) {
      _visibilityState.value = state.features.visibility
    }
  }

  // 監聽變更並保存
  watch(
    _visibilityState,
    async (newState) => {
      await storageManager?.updateFeature("visibility", {
        columns: newState,
      })
    },
    { deep: true },
  )

  initialize()

  return {
    columnVisibilityConfig,
    visibilityState: readonly(_visibilityState),
    onUpdateVisibilityState: updateOrValue => valueUpdater(updateOrValue, _visibilityState),
  }
}

type columnVisibilityConfig = Array<ColumnVisibility>

interface ColumnVisibility {
  key: string
  visibility: boolean
  disabled: boolean
  onChange: (event: unknown) => void
}
