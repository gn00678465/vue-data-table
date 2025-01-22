import type { PaginationState, Updater } from "@tanstack/vue-table"
import type { MaybeRef, Ref } from "vue"
import { readonly, ref, toValue } from "vue"
import { valueUpdater } from "./valueUpdater"

export interface PaginationProps extends Partial<PaginationState> {
  rowCount?: number
}

export interface PaginationPrepareReturn {
  pagination: Ref<PaginationState>
  setPagination: (updateOrValue: Updater<PaginationState>) => void
}

export function usePaginationPrepare(
  p: MaybeRef<PaginationProps | false>,
  onPaginationUpdate?: (pagination: PaginationState) => void,
): PaginationPrepareReturn {
  const pagination = ref<PaginationState>(initialPagination(p))

  function initialPagination(p: MaybeRef<PaginationProps | false>): PaginationState {
    const _p = toValue(p)
    return _p
      ? { pageIndex: _p.pageIndex || 0, pageSize: _p.pageSize || 0 }
      : { pageIndex: 0, pageSize: 10 }
  }

  function setPagination(updateOrValue: Updater<PaginationState>): void {
    const res = valueUpdater(updateOrValue, pagination)
    onPaginationUpdate?.(res)
  }

  return {
    pagination: readonly(pagination),
    setPagination,
  }
}
