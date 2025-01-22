# Vue headless data table

- [x] DataTable component
- [x] Row selection
- [] Row expanded
- [x] Pagination
- [] Column ordering
- [] Column pinning
- [] Column sizing
- [] Column Visibility
- [] Column filtering

## Props
```ts
interface DataTableProps<TData extends Record<string, any>> {
  data?: TData[]
  columns?: DataTableColumns<TData> | CreateDataTableColumns<TData>
  rowKey?: (arg: TData) => string
  pagination?: false | PaginationProps
  remote?: boolean
  loading?: boolean
  captionSide?: "top" | "bottom"
  bordered?: boolean
}
```

### Row selection

```ts
const columns = [
  {
    id: "selection",
    header: ({ table }) => h("input", {
      type: "checkbox",
      checked: table.getIsAllRowsSelected(),
      onInput: (e) => { table.getToggleAllRowsSelectedHandler()(e) },
    }),
    cell: ({ row }) => h("input", {
      type: "checkbox",
      checked: row.getIsSelected(),
      disabled: !row.getCanSelect(),
      onInput: (e) => { row.getToggleSelectedHandler()(e) },
    }),
  },
  /** or */
  columnHelper.display({
    id: "selection",
    header: ({ table }) => h("input", {
      type: "checkbox",
      checked: table.getIsAllRowsSelected(),
      onInput: table.getToggleAllRowsSelectedHandler(),
    }),
    cell: ({ row }) => h("input", {
      type: "checkbox",
      checked: row.getIsSelected(),
      disabled: !row.getCanSelect(),
      onInput: row.getToggleSelectedHandler(),
    }),
  }),
]
```

### Pagination

**Props**
```tsx
<DataTable
  remote={true}
  pagination={{ pageIndex: 0, pageSize: 10, rowCount: 100 }}
>
</DataTable>

// Props types
interface Props {
  pagination?: false | PaginationProps
  remote?: boolean
}

interface PaginationProps {
  pageIndex?: number
  pageSize?: number
  rowCount?: number
}
```

- remote: use client-side pagination or server-side pagination

**Event**

- on-update:pagination: `(pagination: Pagination) => void`

```ts
interface Pagination {
  pageIndex: number
  pageSize: number
}
```

**Slot**

```tsx
<template #pagination="api">
  {/* pagination component */}
</template>

// API types
interface API {
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
```
