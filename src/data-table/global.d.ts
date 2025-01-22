import "@tanstack/vue-table"

declare module "@tanstack/vue-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    class?: import("vue").HTMLAttributes["class"]
    style?: string | import("vue").CSSProperties
  }
}
