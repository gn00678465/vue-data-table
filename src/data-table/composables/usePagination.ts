import type { PaginationState, Table, Updater } from "@tanstack/vue-table"
import type { DataTableProps } from "../index.vue"
import { computed, type ComputedRef, reactive } from "vue"

export interface PaginationProps extends Partial<PaginationState> {
  rowCount?: number
}

export interface usePaginationReturn<TData extends Record<string, any>> {
  rowCount: ComputedRef<number | undefined>
  buildPaginationAPI: (table: Table<TData>) => PaginationAPI
}

export interface PaginationAPI {
  page: number
  pageSize: number
  rowCount: () => number
  pageCount: () => number
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

export function usePagination<TData extends Record<string, any>>(props: DataTableProps<TData>): usePaginationReturn<TData> {
  const rowCount = computed(() => {
    if (props.pagination) {
      return props.pagination.rowCount
    }
    return undefined
  })

  function buildPaginationAPI(table: Table<TData>): PaginationAPI {
    return reactive({
      page: computed(() => table.getState().pagination.pageIndex),
      pageSize: computed(() => table.getState().pagination.pageSize),
      rowCount: table.getRowCount,
      pageCount: table.getPageCount,
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
  }

  return {
    rowCount,
    buildPaginationAPI,
  }
}
