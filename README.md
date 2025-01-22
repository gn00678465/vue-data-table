# Vue headless data table

- [x] DataTable component
- [x] Row selection
- [x] Row expanded
- [x] Pagination
- [ ] Column ordering
- [ ] Column pinning
- [ ] Column sizing
- [ ] Column Visibility
- [ ] Column filtering
- [ ] Context menu

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

**Usage**
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
  // other column options
]
```

**Props**

| Prop        | Type        | Default     | Description |
| ----------- | ----------- | ----------- | ----------- |
| checked-row-keys | Array<string> | undefined |        |
| on-update:checked-row-keys | (keys: Array<string>) => void | undefined |        |

### Pagination

**Props**

| Prop        | Type        | Default     | Description |
| ----------- | ----------- | ----------- | ----------- |
| remote | boolean | false | use client-side pagination or server-side pagination |
| pagination | false | PaginationProps | false |        |
| on-update:pagination | (pagination: Pagination) => void | undefined |

```ts
interface PaginationProps {
  pageIndex?: number
  pageSize?: number
  rowCount?: number
}

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

### Row expanded

**Usage**

```ts
const columns = [
  columnHelper.display({
    id: "expand",
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand()
        ? h("button", {
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: "pointer" },
          }, [row.getIsExpanded() ? "👇" : "👉"])
        : ""
    }
  }),
  // other column options
]
```

**Props**

| Prop        | Type        | Default     | Description |
| ----------- | ----------- | ----------- | ----------- |
| expanded-row-key | Array<string> | undefined | |
| expandable | (row: Row<TData>) => boolean | undefined | |
| render-expand | (row: Row<TData>) => VNodeChild | undefined | |
| on-update:expanded-row-keys | (keys: Array<string>) => void | undefined | |
