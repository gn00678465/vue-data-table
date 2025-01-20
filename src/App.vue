<script setup lang="ts">
import { h, ref } from "vue"
import { type CreateDataTableColumns, DataTable, type DataTableColumns } from "./data-table"

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
    columnHelper.group({
      header: "Name",
      footer: props => props.column.id,
      columns: [
        columnHelper.accessor("firstName", {
          cell: info => info.getValue(),
          footer: props => props.column.id,
          enableResizing: false,
          size: 300,
        }),
        columnHelper.accessor(row => row.lastName, {
          id: "lastName",
          cell: (info) => {
            return info.getValue()
          },
          header: () => h("span", "Last Name"),
          footer: props => props.column.id,
        }),
      ],
    }),
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
    key: "fullName",
    title: () => h("span", "_Name_"),
    children: [
      {
        accessor: "firstName",
        key: "firstName",
        title: "First Name",
        width: 300,
      },
      {
        accessor: "lastName",
        key: "lastName",
        title: "Last Name",
      },
    ],
  },
  {
    key: "action",
    title: () => h("span", "Action"),
    render: () => h("button", "action"),
  },
])

const data = ref(defaultData)
</script>

<template>
  <div>
    <p>Data Table (Function)</p>
    <DataTable :columns="createColumns" :data="data" :loading="false" />
    <br>
    <p>Data Table (Array)</p>
    <DataTable :columns="columns" :data="data" :loading="false" caption-side="bottom" />
    <br>
    <p>Empty Data Table (Function)</p>
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
    </DataTable>
  </div>
</template>

<style scoped></style>
