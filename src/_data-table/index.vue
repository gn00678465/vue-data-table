<script setup lang="tsx" generic="TData extends Record<string, any>">
import type { Table as _Table, ColumnDef, ColumnHelper, PaginationState, Row, RowSelectionState, Updater, VisibilityState } from "@tanstack/vue-table"
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
import { usePaginationAPI, type UsePaginationAPIReturn } from "./composables/usePaginationAPI"
import { type PaginationProps, usePaginationPrepare } from "./composables/usePaginationPrepare"
import css from "./css.module.css"
import { initialDevMode, valueUpdater } from "./helpers"
import { renderIconSeparator } from "./renderIconSeparator"

defineOptions({
  name: "DataTable",
})

const props = withDefaults(defineProps<DataTableProps<TData>>(), {
  data: () => [],
  columns: undefined,
  loading: false,
  captionSide: "bottom",
  bordered: true,
  rowKey: undefined,
  remote: false,
  pagination: false,
  expandable: undefined,
  visibilityState: undefined,
  onUpdateVisibilityState: undefined,
  columnSizingState: undefined,
  onUpdateColumnSizingState: undefined,
})

const emits = defineEmits<{
  "update:pagination": [pagination: PaginationState]
}>()

const slots = defineSlots<{
  caption: () => VNodeChild
  empty: () => VNodeChild
  pagination: (api: UsePaginationAPIReturn) => VNodeChild
}>()

const { data, captionSide, bordered } = toRefs(props)

const isEmpty = computed(() => !data.value || (Array.isArray(data.value) && !data.value.length))
const rowCount = computed(() => {
  if (props.pagination && props.remote)
    return props.pagination.rowCount
  return undefined
})

const columnHelper = createColumnHelper<TData>()
const _columns = computed(() => {
  if (typeof props.columns === "function")
    return props.columns(columnHelper)
  if (Array.isArray(props.columns) && !!props.columns.length)
    return props.columns
  return []
})

/** pagination */
const { pagination, setPagination } = usePaginationPrepare(props.pagination, (arg) => {
  emits("update:pagination", arg)
})

/** selection state */
const [checkedRowKeys] = defineModel<string[]>("checked-row-keys", {
  default: [],
})
const _rowSelectionState = computed<RowSelectionState>({
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

/** expanded state */
const [expandedRowKeys] = defineModel<string[]>("expanded-row-keys", {
  default: [],
})

const _expandedState = computed({
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

/**
 * table core
 */
const table = useVueTable<TData>({
  getRowId: props.rowKey,
  getCoreRowModel: getCoreRowModel(),
  get getRowCanExpand() {
    return props.expandable
  },
  paginateExpandedRows: false,
  manualExpanding: true,
  manualPagination: props.remote,
  getPaginationRowModel: !props.remote ? getPaginationRowModel() : undefined,
  get rowCount() {
    return rowCount.value
  },
  get columns() {
    return _columns.value
  },
  data,
  defaultColumn: {
    size: 0,
    minSize: 0,
    maxSize: 0,
  },
  state: {
    get rowSelection() { return _rowSelectionState.value },
    get pagination() {
      if (props.pagination) {
        return pagination.value
      }
      return undefined
    },
    get expanded() { return _expandedState.value },
    get columnVisibility() { return props.visibilityState },
  },
  enableRowSelection: true,
  onRowSelectionChange: updateOrValue => valueUpdater(updateOrValue, _rowSelectionState),
  onPaginationChange: setPagination,
  onExpandedChange: updateOrValue => valueUpdater(updateOrValue, _expandedState),
  onColumnVisibilityChange: props.onUpdateVisibilityState,
})
const columnspan = computed(() => {
  return table.getAllLeafColumns().length
})
const paginationAPI = usePaginationAPI(table)

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
                              { renderIconSeparator({ class: css["data-table-icon-separator"] }) }
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
          props.renderExpand && row.getIsExpanded() && (
            <TableRow>
              <TableCell colspan={row.getVisibleCells().length}>
                <div class={css["data-table-cell"]}>
                  { props.renderExpand(row) }
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

defineExpose<DataTableInst<TData>>({
  tableInstance: table,
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

/** extra props */
interface DataTableExtraProps {
  visibilityState?: VisibilityState
  onUpdateVisibilityState?: (updateOrValue: Updater<VisibilityState>) => void
}

export type DataTableColumns<TData extends Record<string, any>> = ColumnDef<TData>[]

export type CreateDataTableColumns<TData extends Record<string, any>> = (helper: ColumnHelper<TData>) => DataTableColumns<TData>

export interface DataTableProps<TData extends Record<string, any>> extends
  DataTableBaseProps<TData>,
  DataTablePaginationProps,
  DataTableExpandProps<TData>,
  DataTableExtraProps {
  columns?: DataTableColumns<TData> | CreateDataTableColumns<TData>
}

export interface DataTableInst<TData extends Record<string, any>> {
  tableInstance: _Table<TData>
}
</script>

<template>
  <div>
    <div :class="clsx('w-full', 'relative', 'overflow-auto')">
      <Table :class="clsx('w-full', [bordered && 'data-table--bordered'])">
        <TableCaption
          v-if="!!slots?.caption"
          :class="clsx(
            { 'cation-top': captionSide === 'top' },
            { 'cation-bottom': captionSide === 'bottom' },
          )"
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
    <slot name="pagination" v-bind="paginationAPI" />
  </div>
</template>

<style>
@import url('./assets/reset.css');

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
