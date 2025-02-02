import type { ColumnOrderState, Updater } from "@tanstack/vue-table"
import type { Ref } from "vue"
import { readonly, ref } from "vue"
import { PersistentStorage, valueUpdater } from "../helpers"

export interface UseColumnOrderOptions {
  /**
   * 用於持久化存儲的鍵名
   * 如果不提供，則不會進行持久化
   */
  persistKey?: string
}

export interface UseColumnOrderReturn {
  orderState: Ref<ColumnOrderState>
  onUpdateOrderState: (updaterOrValue: Updater<ColumnOrderState>) => void
}

export function useColumnOrder(options: UseColumnOrderOptions = {}): UseColumnOrderReturn {
  const { persistKey } = options
  const storage = PersistentStorage.getInstance()

  const _orderState = persistKey
    ? storage.getState(persistKey, "orderState", [])
    : ref<ColumnOrderState>([])

  return {
    orderState: (readonly(_orderState) as Ref<ColumnOrderState>),
    onUpdateOrderState: (updateOrValue: Updater<ColumnOrderState>) => {
      valueUpdater(updateOrValue, _orderState)
    },
  }
}
