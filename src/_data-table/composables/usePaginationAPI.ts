import type { PaginationState, Table, Updater } from "@tanstack/vue-table"
import { computed, reactive } from "vue"

export interface UsePaginationAPIReturn {
  page: number
  pageSize: number
  rowCount: number
  pageCount: number
  getCanPreviousPage: () => boolean
  getCanNextPage: () => boolean
  previousPage: () => void
  nextPage: () => void
  table: () => void
  lastPage: () => void
  setPageIndex: (updater: Updater<number>) => void
  resetPageIndex: (defaultState?: boolean) => void
  setPageSize: (updater: Updater<number>) => void
  resetPageSize: (defaultState?: boolean) => void
  setPagination: (updater: Updater<PaginationState>) => void
  resetPagination: (defaultState?: boolean) => void
}

export function usePaginationAPI<T extends Record<string, any>>(table: Table<T>): UsePaginationAPIReturn {
  const result = reactive({
    page: computed(() => table.getState().pagination.pageIndex),
    pageSize: computed(() => table.getState().pagination.pageSize),
    rowCount: computed(table.getRowCount),
    pageCount: computed(table.getPageCount),
    getCanPreviousPage: table.getCanPreviousPage,
    getCanNextPage: table.getCanNextPage,
    previousPage: table.previousPage,
    nextPage: table.nextPage,
    table: table.firstPage,
    lastPage: table.lastPage,
    setPageIndex: table.setPageIndex,
    resetPageIndex: table.resetPageIndex,
    setPageSize: table.setPageSize,
    resetPageSize: table.resetPageSize,
    setPagination: table.setPagination,
    resetPagination: table.resetPagination,
  })

  return result
}
