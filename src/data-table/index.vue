<script setup lang="tsx" generic="TData extends Record<string, any>">
import type { Column, ColumnDef, ColumnHelper, RowSelectionState } from "@tanstack/vue-table"
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table"
import { clsx } from "clsx"
import { computed, type ComputedRef, onBeforeMount, reactive, ref, toRefs, type VNodeChild, watch, withMemo } from "vue"
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
import { useColumnStates, type UseColumnStatesReturn, valueUpdater } from "./helpers"
import style from "./style.module.css"

defineOptions({
  name: "DataTable",
})

const props = withDefaults(defineProps<DataTableProps<TData>>(), {
  data: undefined,
  columns: undefined,
  loading: false,
  captionSide: "bottom",
  bordered: true,
  storage: undefined,
  rowKey: undefined,
})

const slots = defineSlots<{
  caption: () => VNodeChild
  empty: () => VNodeChild
}>()

const { data, captionSide, bordered } = toRefs(props)

const isEmpty = computed(() => !data.value || (Array.isArray(data.value) && !data.value.length))

const columnHelper = createColumnHelper<TData>()
const _columns = computed(() => {
  if (typeof props.columns === "function")
    return props.columns(columnHelper)
  if (Array.isArray(props.columns) && !!props.columns.length)
    return props.columns
  return []
})

/** column state */
const { columnVisibility } = useColumnStates()

/** selection state */
const [rowSelectRowKeys] = defineModel<string[]>("checked-row-keys", {
  default: [],
})
const _rowSelectionState = computed<RowSelectionState>({
  get() {
    return rowSelectRowKeys.value.reduce((obj, key) => {
      obj[key] = true
      return obj
    }, {} as RowSelectionState)
  },
  set(v) {
    rowSelectRowKeys.value = Object.keys(v)
  },
})

const table = useVueTable<TData>({
  getRowId: props.rowKey,
  getCoreRowModel: getCoreRowModel(),
  get columns() {
    return _columns.value
  },
  get data() {
    return data?.value ?? []
  },
  debugTable: import.meta.env.DEV,
  debugHeaders: import.meta.env.DEV,
  debugColumns: import.meta.env.DEV,
  defaultColumn: {
    size: 0,
    minSize: 0,
    maxSize: 0,
  },
  state: {
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return _rowSelectionState.value },
  },
  enableRowSelection: true,
  onRowSelectionChange: updateOrValue => valueUpdater(updateOrValue, _rowSelectionState),
})
const columnspan = computed(() => {
  return table.getAllLeafColumns().length
})

/**
 * Table header render function
 */
function renderTableHeader() {
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
                  : <FlexRender render={header.column.columnDef.header} props={header.getContext()} />
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
function renderTableBody() {
  return (
    table.getRowModel().rows.map(row => (
      <TableRow key={row.id}>
        {
          row.getVisibleCells().map(cell => (
            <TableCell key={cell.id}>
              <FlexRender render={cell.column.columnDef.cell} props={cell.getContext()} />
            </TableCell>
          ))
        }
      </TableRow>
    ))
  )
}

/**
 * Table footer render function
 */
function renderTableFooter() {
  return (
    <TableFooter>
      {
        table.getFooterGroups().map(footerGroup => (
          <TableRow key={footerGroup.id}>
            {
              footerGroup.headers.map(header => (
                <TableHead key={header.id} colspan={header.colSpan}>
                  {
                    header.isPlaceholder
                      ? null
                      : <FlexRender render={header.column.columnDef.footer} props={header.getContext()} />
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

/**
 * column visibility options
 */
const extraColumnOptions = computed<ExtraColumnOption<TData>[]>(() => table.getAllLeafColumns()
  .map(col => ({
    id: col.id,
    disabled: !col.getCanHide(),
    column: col,
  })),
)

defineExpose<DataTableInst<TData>>({
  extraColumnOptions: extraColumnOptions.value,
  allLeafColumns: computed(table.getAllLeafColumns).value,
})

onBeforeMount(() => {
})
</script>

<script lang="tsx">
interface DataTableBaseProps<TData extends Record<string, any>> {
  data?: TData[]
  rowKey?: (arg: TData) => string
  loading?: boolean
  captionSide?: "top" | "bottom"
  bordered?: boolean
  storage?: "cookie" | "localStorage" | "sessionStorage"
  storageKey?: string
}

export interface ExtraColumnOption<TData extends Record<string, any>> {
  id: string
  disabled: boolean
  column: Column<TData>
}

export type CreateDataTableColumns<TData extends Record<string, any>> = (helper: ColumnHelper<TData>) => ColumnDef<TData>[]

export type DataTableColumns<TData> = ColumnDef<TData>[]

export interface DataTableProps<TData extends Record<string, any>> extends DataTableBaseProps<TData> {
  columns?: DataTableColumns<TData> | CreateDataTableColumns<TData>
}

export interface DataTableInst<TData extends Record<string, any>> {
  extraColumnOptions: ExtraColumnOption<TData>[]
  allLeafColumns: Column<TData>[]
}
</script>

<template>
  <div :class="clsx('w-full', 'relative', 'overflow-auto', [bordered && 'data-table--bordered'])">
    <Table :class="clsx('w-full')">
      <TableCaption
        v-if="!!slots?.caption"
        :class="clsx(
          { 'cation-top': captionSide === 'top' },
          { 'cation-bottom': captionSide === 'bottom' },
        )"
      >
        <slot name="caption" />
      </TableCaption>
      <TableHeader>
        <component :is="renderTableHeader" />
      </TableHeader>
      <TableBody>
        <template v-if="!isEmpty">
          <component :is="renderTableBody" />
        </template>
        <template v-else>
          <TableEmpty :colspan="columnspan">
            <slot name="empty" />
          </TableEmpty>
        </template>
      </TableBody>
      <component :is="renderTableFooter" v-if="!isEmpty" />
    </Table>
  </div>
</template>

<style>
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
