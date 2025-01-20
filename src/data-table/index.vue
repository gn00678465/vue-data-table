<script setup lang="tsx" generic="TData extends object">
import type { ColumnDef, ColumnHelper, ColumnPinningState, RowSelectionState, VisibilityState } from "@tanstack/vue-table"
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table"
import { computed, reactive, toRefs, type VNodeChild, withMemo } from "vue"
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
import { columnsAdapter, type DataTableColumns } from "./helpers"

defineOptions({
  name: "DataTable",
})

const props = withDefaults(defineProps<DataTableProps<TData>>(), {
  data: undefined,
  columns: undefined,
  loading: false,
  captionSide: "bottom",
})

const slots = defineSlots<{
  caption: () => VNodeChild
  empty: () => VNodeChild
}>()

const { data, captionSide } = toRefs(props)

const isEmpty = computed(() => !data.value || (Array.isArray(data.value) && !data.value.length))

const columnHelper = createColumnHelper<TData>()
const _columns = computed(() => {
  if (typeof props.columns === "function")
    return props.columns(columnHelper)
  if (Array.isArray(props.columns) && !!props.columns.length)
    return columnsAdapter(props.columns, columnHelper)
  return []
})

const table = useVueTable<TData>({
  getCoreRowModel: getCoreRowModel(),
  get columns() {
    return _columns.value
  },
  get data() {
    return data?.value ?? []
  },
  state: {},
  debugTable: import.meta.env.DEV,
  debugHeaders: import.meta.env.DEV,
  debugColumns: import.meta.env.DEV,
})
const columnspan = computed(() => {
  return table.getAllLeafColumns().length
})

/**
 * Table header
 */
function renderTableHeader() {
  return (
    table.getHeaderGroups().map(headerGroup => (
      <TableRow key={headerGroup.id}>
        {
          headerGroup.headers.map(header => (
            <TableHead key={header.id} colspan={header.colSpan}>
              {
                !header.isPlaceholder && <FlexRender render={header.column.columnDef.header} props={header.getContext()} />
              }
            </TableHead>
          ))
        }
      </TableRow>
    ))
  )
}

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
                    !header.isPlaceholder && <FlexRender render={header.column.columnDef.footer} props={header.getContext()} />
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

const styles = reactive({
  "--caption-side": computed(() => captionSide.value),
})
</script>

<script lang="tsx">
interface DataTableBaseProps<TData extends object> {
  data?: TData[]
  loading?: boolean
  captionSide?: "top" | "bottom"
}

export type CreateDataTableColumns<TData extends object> = (helper: ColumnHelper<TData>) => ColumnDef<TData>[]

export interface DataTableProps<TData extends object> extends DataTableBaseProps<TData> {
  columns?: DataTableColumns<TData> | CreateDataTableColumns<TData>
}
</script>

<template>
  <div :style="styles">
    <Table>
      <TableCaption v-if="!!slots?.caption">
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

<style module></style>
