import type { Column, Table, Updater, VisibilityState } from "@tanstack/vue-table"
import type { ComputedRef, Ref } from "vue"
import { computed, ref, watch } from "vue"
import { type TableStorageManager, valueUpdater } from "../helpers"

export interface UseTableVisibilityReturn {
  columnVisibilityConfig: ComputedRef<columnVisibilityConfig>
  visibilityState: Ref<VisibilityState>
  onUpdateVisibilityState: (updateOrValue: Updater<VisibilityState>) => void
  toggleAllColumnsVisible: (value: boolean) => void
  isAllVisible: ComputedRef<boolean>
  isSomeVisible: ComputedRef<boolean>
}

export function useTableVisibility<TData extends Record<string, any>>(
  table: ComputedRef<Table<TData> | undefined>,
  storage?: TableStorageManager,
): UseTableVisibilityReturn {
  const _visibilityState = ref<VisibilityState>({})

  /**
   * visibility state config
   */
  function buildVisibilityConfig(column: Column<TData>): ColumnVisibility {
    return {
      key: column.id,
      visibility: column.getIsVisible(),
      disabled: !column.getCanHide(),
      onChange: column.getToggleVisibilityHandler(),
    }
  }
  const columnVisibilityConfig = computed<columnVisibilityConfig>(() => table.value?.getAllLeafColumns().map(buildVisibilityConfig) || [])

  // 初始化
  async function initialize(): Promise<void> {
    const state = await storage?.getState()
    if (state && state.features.visibility) {
      _visibilityState.value = state.features.visibility
    }
  }

  // 全域控制方法
  const toggleAllColumnsVisible = (value: boolean): void => {
    table.value?.toggleAllColumnsVisible(value)
  }

  const isAllVisible = computed(() => table.value?.getIsAllColumnsVisible() || false)
  const isSomeVisible = computed(() => table.value?.getIsSomeColumnsVisible() || false)

  // 監聽變更並保存
  watch(
    _visibilityState,
    async (newState) => {
      await storage?.updateFeature("visibility", newState)
    },
    { deep: true },
  )

  initialize()

  return {
    visibilityState: _visibilityState,
    onUpdateVisibilityState: (updateOrValue: Updater<VisibilityState>) => {
      valueUpdater(updateOrValue, _visibilityState)
    },
    columnVisibilityConfig,
    toggleAllColumnsVisible,
    isAllVisible,
    isSomeVisible,
  }
}

type columnVisibilityConfig = Array<ColumnVisibility>

interface ColumnVisibility {
  key: string
  visibility: boolean
  disabled: boolean
  onChange: (event: unknown) => void
}
