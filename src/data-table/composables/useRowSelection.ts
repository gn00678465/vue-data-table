import type { RowSelectionState } from "@tanstack/vue-table"
import { computed, type ComputedRef, type Ref } from "vue"

export function useRowSelection(checkedRowKeys: Ref<string[]>): ComputedRef<RowSelectionState> {
  const rowSelectionState = computed<RowSelectionState>({
    get() {
      return checkedRowKeys.value.reduce((obj, key) => {
        obj[key] = true
        return obj
      }, {} as RowSelectionState)
    },
    set(v) {
      checkedRowKeys.value = Object.keys(v)
    },
  })

  return rowSelectionState
}
