import type { ExpandedState } from "@tanstack/vue-table"
import { computed, type ComputedRef, type Ref } from "vue"

export function useExpanded(expandedRowKeys: Ref<string[]>): ComputedRef<ExpandedState> {
  const expandedState = computed({
    get() {
      return expandedRowKeys.value.reduce((obj, key) => {
        obj[key] = true
        return obj
      }, {} as Record<string, boolean>)
    },
    set(v) {
      expandedRowKeys.value = Object.keys(v)
    },
  })

  return expandedState
}
