# Vue headless data table

- [x] DataTable component
- [] Row selection
- [] Row expanded
- [] Pagination
- [] Column ordering
- [] Column pinning
- [] Column sizing
- [] Column Visibility
- [] Column filtering

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
