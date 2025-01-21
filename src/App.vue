<script setup lang="ts">
import { h, ref } from "vue"
import { type CreateDataTableColumns, DataTable, type DataTableColumns, type DataTableInst, type ExtraColumnOption } from "./data-table"

interface Person {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Person[] = [
  {
    firstName: "tanner",
    lastName: "linsley",
    age: 24,
    visits: 100,
    status: "In Relationship",
    progress: 50,
  },
  {
    firstName: "tandy",
    lastName: "miller",
    age: 40,
    visits: 40,
    status: "Single",
    progress: 80,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
  },
]

const createColumns: CreateDataTableColumns<Person> = (columnHelper) => {
  return [
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
      size: 60,
    }),
    {
      header: "Name",
      footer: props => props.column.id,
      columns: [
        {
          accessorKey: "firstName",
          cell: info => info.getValue(),
          footer: props => props.column.id,
          enableResizing: false,
          size: 300,
          minSize: 0,
          meta: {
            class: "w-full",
          },
        },
        {
          accessorKey: "lastName",
          id: "lastName",
          cell: (info) => {
            return info.getValue()
          },
          header: () => h("span", "Last Name"),
          footer: props => props.column.id,
        },
      ],
    },
    columnHelper.group({
      header: "Info",
      id: "Info",
      footer: props => props.column.id,
      columns: [
        columnHelper.accessor("age", {
          header: () => "Age",
          footer: props => props.column.id,
        }),
        columnHelper.group({
          header: "More Info",
          columns: [
            columnHelper.accessor("visits", {
              header: () => "Visits",
              footer: props => props.column.id,
            }),
            columnHelper.accessor("status", {
              header: "Status",
              footer: props => props.column.id,
            }),
            columnHelper.accessor("progress", {
              header: "Profile Progress",
              footer: props => props.column.id,
            }),
          ],
        }),
      ],
    }),
    columnHelper.display({
      id: "action",
      header: "Action",
      cell: () => h("button", "action"),
    }),
  ]
}

const columns = ref<DataTableColumns<Person>>([
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
    size: 60,
  },
  {
    accessorKey: "firstName",
    cell: info => info.getValue(),
    enableResizing: false,
    size: 300,
    minSize: 0,
    enableHiding: false,
  },
  {
    accessorKey: "lastName",
    id: "lastName",
    cell: (info) => {
      return info.getValue()
    },
    header: () => h("span", "Last Name"),
  },
  {
    accessorKey: "action",
    header: () => h("span", "Action"),
    cell: () => h("button", "action"),
  },
])

const data = ref(defaultData)

const dataTableFunRef = ref<DataTableInst<Person>>()
const dataTableArrRef = ref<DataTableInst<Person>>()

const checkedKeys = ref<string[]>([])
</script>

<template>
  <div>
    <p>Data Table (Function)</p>
    <ul>
      <li v-for="column of (dataTableFunRef?.allLeafColumns ?? [])" :key="column.id">
        <input type="checkbox" :checked="column.getIsVisible()" :disabled="!column.getCanHide()">
        <span>{{ column.id }}</span>
      </li>
    </ul>
    <DataTable
      ref="dataTableFunRef"
      :columns="createColumns"
      :data="data"
      :loading="false"
      style="--border-color: #000"
    />
    <br>
    <p>Data Table (Array)</p>
    <ul>
      <li v-for="column of (dataTableArrRef?.allLeafColumns ?? [])" :key="column.id">
        <input type="checkbox" :checked="column.getIsVisible()" :disabled="!column.getCanHide()">
        <span>{{ column.id }}</span>
      </li>
    </ul>
    <DataTable
      ref="dataTableArrRef"
      v-model:checked-row-keys="checkedKeys"
      :columns="columns"
      :data="data"
      :loading="false"
      :row-key="(row) => row.firstName"
      caption-side="bottom"
      style="--border-color: #000"
    />
    <br>
    <!-- <p>Empty Data Table (Function)</p>
    <DataTable :columns="createColumns" :data="[]" :loading="false">
      <template #empty>
        empty
      </template>
    </DataTable>
    <br>
    <p>Empty Data Table (Array)</p>
    <DataTable :columns="columns" :data="[]" :loading="false">
      <template #empty>
        empty
      </template>
    </DataTable> -->
  </div>
</template>

<style scoped></style>
