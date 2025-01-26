<script setup lang="tsx" generic="TData extends Record<string, any>">
import type { Table as _Table, ColumnDef, ColumnHelper, Row } from "@tanstack/vue-table"
import { createColumnHelper, FlexRender, getCoreRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table"
import { clsx } from "clsx"
import { computed, Fragment, onBeforeMount, toRefs, type VNodeChild } from "vue"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../table"
import { useExpanded } from "./composables/useExpanded"
import { type PaginationAPI, type PaginationProps, usePagination } from "./composables/usePagination"
import { useRowSelection } from "./composables/useRowSelection"
import { type ColumnVisibilityConfig, useTableVisibility } from "./composables/useTableVisibility"
import css from "./css.module.css"
import { initialDevMode, valueUpdater } from "./helpers"

const props = withDefaults(defineProps<DataTableProps<TData>>(), {
  columns: undefined,
  data: () => ([]),
  expandable: undefined,
  renderExpand: undefined,
  remote: false,
  pagination: false,
})

const slots = defineSlots<{
  caption: () => VNodeChild
  empty: () => VNodeChild
  pagination: (api: PaginationAPI) => VNodeChild
}>()

const { data, columns, captionSide, bordered, loading, expandable, renderExpand } = toRefs(props)
const isEmpty = computed(() => !data.value || (Array.isArray(data.value) && !data.value.length))
const columnspan = computed(() => table.getAllLeafColumns().length)

const columnHelper = createColumnHelper<TData>()
const _columns = computed(() => {
  if (typeof columns.value === "function")
    return columns.value(columnHelper)
  if (Array.isArray(columns.value) && !!columns.value.length)
    return columns.value
  return []
})

/** selection state */
const [checkedRowKeys] = defineModel<string[]>("checked-row-keys", {
  default: [],
})
const _rowSelectionState = useRowSelection(checkedRowKeys)

/** expanded state */
const [expandedRowKeys] = defineModel<string[]>("expanded-row-keys", {
  default: [],
})
const _expandedState = useExpanded(expandedRowKeys)

/** pagination */
const { rowCount, buildPaginationAPI } = usePagination(props)

/** columns visibility */
const { visibilityState, onUpdateVisibilityState, buildVisibilityConfig } = useTableVisibility()

const table = useVueTable({
  // core
  data,
  get columns() { return _columns.value },
  getCoreRowModel: getCoreRowModel(),
  getRowId: props.rowKey,
  // row selection
  paginateExpandedRows: false,
  enableRowSelection: true,
  onRowSelectionChange: updateOrValue => valueUpdater(updateOrValue, _rowSelectionState),
  // expanded
  get getRowCanExpand() { return expandable.value },
  manualExpanding: true,
  onExpandedChange: updateOrValue => valueUpdater(updateOrValue, _expandedState),
  // pagination
  manualPagination: props.remote,
  getPaginationRowModel: !props.remote ? getPaginationRowModel() : undefined,
  get rowCount() { return rowCount.value },
  // columns visibility
  onColumnVisibilityChange: onUpdateVisibilityState,
  initialState: {
    get pagination() {
      if (props.pagination) {
        return {
          pageIndex: props.pagination.pageIndex || 0,
          pageSize: props.pagination.pageSize || 10,
        }
      }
      return undefined
    },
  },
  // state
  state: {
    get rowSelection() { return _rowSelectionState.value },
    get expanded() { return _expandedState.value },
    get columnVisibility() { return visibilityState.value },
  },
})

/** Table colgroup render function */
function renderColgroup(table: _Table<TData>) {
  return (
    <colgroup>
      {
        table.getAllLeafColumns().map(col => (
          <col key={col.id} />
        ))
      }
    </colgroup>
  )
}

/**
 * Table header render function
 */
function renderTableHeader(table: _Table<TData>) {
  return (
    table.getHeaderGroups().map(headerGroup => (
      <TableRow key={headerGroup.id}>
        {
          headerGroup.headers.map(header => (
            <TableHead
              key={header.id}
              colspan={header.colSpan || 1}
              rowspan={header.rowSpan || 1}
            >
              {
                header.isPlaceholder
                  ? null
                  : (
                      <div class={css["data-table-header"]}>
                        <div>
                          <FlexRender render={header.column.columnDef.header} props={header.getContext()} />
                        </div>
                        {
                          header.column.getCanResize() && !header.subHeaders.length && (
                            <div
                              class={css["data-table-col-separator"]}
                              onMousedown={header.getResizeHandler()}
                              onTouchstart={header.getResizeHandler()}
                            >
                              {/* { renderIconSeparator({ class: css["data-table-icon-separator"] }) } */
                              }
                            </div>
                          )
                        }
                      </div>
                    )
              }
            </TableHead>
          ))
        }
      </TableRow>
    ))
  )
}

/**
 * Table body render function
 */
function renderTableBody(table: _Table<TData>) {
  return (
    table.getRowModel().rows.map(row => (
      <Fragment>
        <TableRow key={row.id}>
          {
            row.getVisibleCells().map(cell => (
              <TableCell key={cell.id}>
                <div class={css["data-table-cell"]}>
                  <FlexRender render={cell.column.columnDef.cell} props={cell.getContext()} />
                </div>
              </TableCell>
            ))
          }
        </TableRow>
        {
          renderExpand.value && row.getIsExpanded() && (
            <TableRow>
              <TableCell colspan={row.getVisibleCells().length}>
                <div class={css["data-table-cell"]}>
                  { renderExpand.value(row) }
                </div>
              </TableCell>
            </TableRow>
          )
        }
      </Fragment>
    ))
  )
}

/**
 * Table footer render function
 */
function renderTableFooter(table: _Table<TData>) {
  return (
    <TableFooter>
      {
        table.getFooterGroups().map(footerGroup => (
          <TableRow key={footerGroup.id}>
            {
              footerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  colspan={header.colSpan || 1}
                  rowspan={header.rowSpan || 1}
                >
                  {
                    header.isPlaceholder
                      ? null
                      : (
                          <div class={css["data-table-header"]}>
                            <div>
                              <FlexRender render={header.column.columnDef.footer} props={header.getContext()} />
                            </div>
                          </div>
                        )
                  }
                </TableHead>
              ))
            }
          </TableRow>
        ))
      }
    </TableFooter>
  )
}

/** expose */
defineExpose({
  /** columns visibility expose */
  ...toRefs(buildVisibilityConfig(table)),
})

onBeforeMount(() => {
  initialDevMode(table)
})
</script>

<script lang="tsx">
interface DataTableBaseProps<TData extends Record<string, any>> {
  data?: TData[]
  rowKey?: (arg: TData) => string
  loading?: boolean
  captionSide?: "top" | "bottom"
  bordered?: boolean
}

/** pagination props */
interface DataTablePaginationProps {
  pagination?: false | PaginationProps
  remote?: boolean
}

/** expanded props */
interface DataTableExpandProps<TData extends Record<string, any>> {
  expandable?: (row: Row<TData>) => boolean
  renderExpand?: (row: Row<TData>) => VNodeChild
}

export type DataTableColumns<TData extends Record<string, any>> = ColumnDef<TData>[]

export type CreateDataTableColumns<TData extends Record<string, any>> = (helper: ColumnHelper<TData>) => DataTableColumns<TData>

export interface DataTableProps<TData extends Record<string, any>> extends
  DataTableBaseProps<TData>,
  DataTablePaginationProps,
  DataTableExpandProps<TData> {
  columns?: DataTableColumns<TData> | CreateDataTableColumns<TData>
}

export interface DataTableInst extends ColumnVisibilityConfig {}
</script>

<template>
  <div>
    <div :class="clsx('w-full', 'relative', 'overflow-auto')">
      <Table :class="clsx('w-full', [bordered && 'data-table--bordered'])">
        <TableCaption
          v-if="!!slots?.caption"
          :class="{
            [css['data-table-caption--top']]: captionSide === 'top',
            [css['data-table-caption--bottom']]: captionSide === 'bottom',
          }"
        >
          <slot name="caption" />
        </TableCaption>
        <component :is="() => renderColgroup(table)" />
        <TableHeader>
          <component :is="() => renderTableHeader(table)" />
        </TableHeader>
        <TableBody>
          <template v-if="!isEmpty">
            <component :is="() => renderTableBody(table)" />
          </template>
          <template v-else>
            <TableEmpty :colspan="columnspan">
              <slot name="empty" />
            </TableEmpty>
          </template>
        </TableBody>
        <component :is="() => renderTableFooter(table)" v-if="!isEmpty" />
      </Table>
    </div>
    <slot name="pagination" v-bind="buildPaginationAPI(table)" />
  </div>
</template>

<style scoped>
:where(.overflow-auto) {
  overflow: auto;
}

:where(.w-full) {
  width: 100%;
}

:where(.relative) {
  position: relative;
}

:where(.caption-top) {
  caption-side: top;
}

:where(.caption-bottom) {
  caption-side: bottom;
}

:where(.data-table--bordered) {
  border: 1px solid var(--border-color, transparent);
}
</style>
