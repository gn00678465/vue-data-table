import type { AccessorFn, ColumnDef, ColumnHelper, DeepKeys, DisplayColumnDef } from "@tanstack/vue-table"
import type { VNodeChild } from "vue"
import { createColumnHelper } from "@tanstack/vue-table"

interface DataTableColumnBase<TData extends object> {
  key: string
  fix?: false | "right" | "left"
  width?: number
  maxWidth?: number
  minWidth?: number
  // FIXME: extension and fix type
  render?: ({ row }: { row: TData }) => VNodeChild
  title?: string | (() => VNodeChild)
}

interface DataTableColumnCell<TData extends object> extends DataTableColumnBase<TData> {
  accessorKey: AccessorFn<TData> | DeepKeys<TData>
}

interface DataTableColumnGroup<TData extends object> {
  key: string
  title?: string
  children: DataTableColumn<TData>[]
}

interface DataTableColumnSelection<TData extends object> extends DataTableColumnBase<TData> {
  type?: "selection"
}

interface DataTableColumnExpand<TData extends object> extends DataTableColumnBase<TData> {
  type?: "expand"
}

function isColumnGroup<TData extends object>(
  column: DataTableColumn<TData>,
): column is DataTableColumnGroup<TData> {
  return "children" in column && Array.isArray(column.children)
}

// function isColumSelection<TData extends object>(
//   column: DataTableColumn<TData>
// ): column is DataTableColumnSelection<TData> {
//   return 'type' in column && column.type === 'selection'
// }

// function isColumnExpand<TData extends object>(
//   column: DataTableColumn<TData>
// ): column is DataTableColumnExpand<TData> {
//   return 'type' in column && column.type === 'expand'
// }

function isColumnCell<TData extends object>(
  column: DataTableColumn<TData>,
): column is DataTableColumnCell<TData> {
  return "accessor" in column && (typeof column.accessor === "function" || typeof column.accessor === "string")
}

/**
 * 建立 display options
 * @param column
 * @returns DisplayColumnDef<TData>
 */
function columnOptions<TData extends object>(
  column: DataTableColumnCell<TData> | DataTableColumnBase<TData>,
): DisplayColumnDef<TData> {
  return {
    id: column.key,
    header(info) {
      if (column.title) {
        if (typeof column.title === "function")
          return column.title()
        else return column.title
      }
      return info.header.id
    },
    cell: info => column.render ? column.render({ row: info.row.original }) : info.getValue(),
    size: column.width,
  }
}

export type DataTableColumn<TData extends object> =
  DataTableColumnCell<TData> |
  DataTableColumnGroup<TData> |
  DataTableColumnSelection<TData> |
  DataTableColumnExpand<TData>

export type DataTableColumns<TData extends object> = DataTableColumn<TData>[]

/**
 * column 適配器
 * @param column
 * @param helper
 * @returns ColumnDef<TData>
 */
function columnAdapter<TData extends object>(column: DataTableColumn<TData>, helper: ColumnHelper<TData>): ColumnDef<TData> {
  if (isColumnGroup(column)) {
    return helper.group({
      id: column.key,
      header: column.title || column.key,
      columns: columnsAdapter(column.children, helper),
    })
  }
  // if (isColumSelection(column)) return undefined
  // if (isColumnExpand(column)) return undefined
  if (isColumnCell(column))
    return helper.accessor(column.accessorKey, columnOptions(column))
  return helper.display(columnOptions(column))
}

/**
 * columns 適配器
 * @param columns
 * @returns ColumnDef<TData>[]
 */
export function columnsAdapter<TData extends object>(columns?: DataTableColumns<TData>, helper?: ColumnHelper<TData>): ColumnDef<TData>[] {
  if (!columns)
    return []
  helper = helper || createColumnHelper()
  return columns.flatMap(column => columnAdapter(column, helper))
}
