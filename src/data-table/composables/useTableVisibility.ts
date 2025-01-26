import type { Column, Table, Updater, VisibilityState } from "@tanstack/vue-table"
import type { Ref } from "vue"
import { computed, reactive, ref } from "vue"
import { PersistentStorage, valueUpdater } from "../helpers"

export interface UseTableVisibilityOptions {
  /**
   * 用於持久化存儲的鍵名
   * 如果不提供，則不會進行持久化
   */
  persistKey?: string
}

export interface ColumnVisibilityConfig {
  isAllVisible: boolean
  isSomeVisible: boolean
  toggleAllColumnsVisible: (value?: boolean) => void
  columnVisibilityConfig: ColumnVisibility[]
}

export interface UseTableVisibilityReturn {
  /**
   * 列可見性狀態
   */
  visibilityState: Ref<VisibilityState>
  /**
   * 更新列可見性狀態的方法
   */
  onUpdateVisibilityState: (updateOrValue: Updater<VisibilityState>) => void
  /**
   * 清除持久化狀態的方法
   */
  clearVisibilityState: () => void
  /**
   * 建立列可見性配置的方法
   * @param table
   * @returns
   */
  buildVisibilityConfig: <TData extends Record<string, any>>(table: Table<TData>) => ColumnVisibilityConfig
}

/**
 * 表格列可見性控制 Hook
 * @param options - 配置選項
 * @returns 列可見性控制相關的狀態和方法
 */
export function useTableVisibility(
  options: UseTableVisibilityOptions = {},
): UseTableVisibilityReturn {
  const { persistKey } = options
  const storage = PersistentStorage.getInstance()

  // 如果提供了 persistKey，使用持久化的狀態
  const _visibilityState = persistKey
    ? storage.getState(persistKey, "visibilityState", {})
    : ref<VisibilityState>({})

  // 更新狀態的方法
  const onUpdateVisibilityState = (updateOrValue: Updater<VisibilityState>): void => {
    valueUpdater(updateOrValue, _visibilityState)
  }

  /**
   * visibility state config
   */
  function buildColumnVisibilityConfig<TData extends Record<string, any>>(column: Column<TData>): ColumnVisibility {
    return {
      key: column.id,
      visibility: column.getIsVisible(),
      disabled: !column.getCanHide(),
      onChange: column.getToggleVisibilityHandler(),
    }
  }

  /**
   * visibility config
   * @param table
   */
  function buildVisibilityConfig<TData extends Record<string, any>>(table: Table<TData>): ColumnVisibilityConfig {
    return reactive({
      isAllVisible: computed(() => table.getIsAllColumnsVisible()),
      isSomeVisible: computed(() => table.getIsSomeColumnsVisible()),
      toggleAllColumnsVisible: table.toggleAllColumnsVisible,
      columnVisibilityConfig: computed<Array<ColumnVisibility>>(() => table.getAllLeafColumns().map(buildColumnVisibilityConfig)),
    })
  }

  return {
    visibilityState: _visibilityState,
    onUpdateVisibilityState,
    clearVisibilityState: () => {
      if (persistKey) {
        storage.clearState(persistKey)
        _visibilityState.value = {}
      }
    },
    buildVisibilityConfig,
  }
}

interface ColumnVisibility {
  key: string
  visibility: boolean
  disabled: boolean
  onChange: (event: unknown) => void
}
