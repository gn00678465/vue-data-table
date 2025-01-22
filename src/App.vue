<script setup lang="ts">
import { computed, h, reactive, ref } from "vue"
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

window.setTimeout(() => {
  data.value = [...data.value].concat(defaultData)
}, 10000)

const checkedKeys = ref<string[]>([])

const pagination = reactive({
  pageIndex: 0,
  pageSize: 1,
  rowCount: computed(() => data.value.length),
})
</script>

<template>
  <div>
    <p>Data Table (Function)</p>
    <DataTable
      :columns="createColumns"
      :data="data"
      :loading="false"
      style="--border-color: #000"
    />
    <br>
    <p>Data Table (Array)</p>
    <DataTable
      v-model:checked-row-keys="checkedKeys"
      :columns="columns"
      :data="data"
      :loading="false"
      :row-key="(row) => row.firstName"
      :remote="true"
      caption-side="bottom"
      style="--border-color: #000"
      :pagination="pagination"
    >
      <template #pagination="api">
        <div class="pagination">
          {{ JSON.stringify(api) }}
          <button
            class="border rounded p-1"
            :disabled="!api.getCanPreviousPage()"
            @click="() => api.setPageIndex(0)"
          >
            «
          </button>
          <button
            class="border rounded p-1"
            :disabled="!api.getCanPreviousPage()"
            @click="() => api.previousPage()"
          >
            ‹
          </button>
          <button
            class="border rounded p-1"
            :disabled="!api.getCanNextPage()"
            @click="() => api.nextPage()"
          >
            ›
          </button>
          <button
            class="border rounded p-1"
            :disabled="!api.getCanNextPage()"
            @click="() => api.setPageIndex(api.pageCount - 1)"
          >
            »
          </button>
          <span class="pagination-content">
            <div>Total</div>
            <strong>
              {{ api.page + 1 }} of
              {{ api.rowCount }}
            </strong>
          </span>
        </div>
      </template>
    </DataTable>
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

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: start;
  column-gap: 8px;
  margin-top: 8px;
  padding-left: 8px;
  padding-right: 8px;
}

.pagination-content {
  display: flex;
  align-items: center;
  column-gap: 4px;
}
</style>
