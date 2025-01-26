<script setup lang="ts">
import { faker } from "@faker-js/faker"
import { computed, h, reactive, ref } from "vue"
import { type CreateDataTableColumns, DataTable, type DataTableColumns } from "./data-table"

interface Person {
  _id: string
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

function createRandomUser(): Person {
  return {
    _id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.helpers.rangeToNumber({ min: 20, max: 50 }),
    status: faker.helpers.arrayElement(["In Relationship", "Single", "Complicated"]),
    progress: faker.helpers.rangeToNumber({ min: 10, max: 100 }),
    visits: faker.number.int({ max: 10000 }),
  }
}

const createColumns: CreateDataTableColumns<Person> = (columnHelper) => {
  return [
    columnHelper.display({
      id: "expand",
      header: () => null,
      cell: ({ row }) => {
        return row.getCanExpand()
          ? h("button", {
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: "pointer" },
            }, [row.getIsExpanded() ? "👇" : "👉"])
          : "🔵"
      },
      enableResizing: false,
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
          enableResizing: true,
          size: 300,
          minSize: 0,
          meta: {
            class: "w-full",
            titleAlign: "left",
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
          meta: {
            align: "right",
          },
        }),
        columnHelper.group({
          header: "More Info",
          columns: [
            columnHelper.accessor("visits", {
              header: () => "Visits",
              footer: props => props.column.id,
              meta: {
                align: "right",
              },
            }),
            columnHelper.accessor("status", {
              header: "Status",
              footer: props => props.column.id,
              meta: {
                align: "center",
              },
            }),
            columnHelper.accessor("progress", {
              header: "Profile Progress",
              footer: props => props.column.id,
              meta: {
                align: "right",
              },
            }),
          ],
        }),
      ],
    }),
    columnHelper.display({
      id: "action",
      header: "Action",
      cell: () => h("button", "action"),
      meta: {
        align: "center",
      },
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
      onInput: row.getToggleSelectedHandler(),
    }),
    enableResizing: false,
    size: 60,
  },
  {
    accessorKey: "firstName",
    cell: info => info.getValue(),
    enableResizing: true,
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

const data = ref<Person[]>([])

window.setTimeout(() => (
  data.value = [...Array.from({ length: 15 })].map(() => createRandomUser())
), 5000)

const expandedKeys = ref<string[]>([])
const checkedKeys = ref<string[]>([])

// const DataTableFunRef = ref<DataTableInst<Person>>()
// const DataTableArrRef = ref<DataTableInst<Person>>()

// const tableInstance = computed(() => toValue(DataTableFunRef)?.tableInstance)

// const {
//   visibilityState,
//   onUpdateVisibilityState,
//   columnVisibilityConfig,
//   toggleAllColumnsVisible,
//   isAllVisible,
// } = useDataTable(tableInstance, { storage: "localStorage" })

const pagination = reactive({
  pageIndex: 0,
  pageSize: 1,
  rowCount: computed(() => data.value.length),
})
</script>

<template>
  <div>
    <p>Data Table (Function)</p>
    <!-- <ul>
      <li>
        <label>
          <input type="checkbox" :checked="isAllVisible" @input="toggleAllColumnsVisible(true)">
          Toggle All
        </label>
        <hr>
      </li>
      <li v-for="col of columnVisibilityConfig" :key="col.key">
        <label>
          <input type="checkbox" :checked="col.visibility" @input="col.onChange">
          {{ col.key }}
        </label>
      </li>
    </ul> -->
    <DataTable
      v-model:expanded-row-keys="expandedKeys"
      :columns="createColumns"
      :data="data"
      :loading="false"
      :row-key="(row) => row._id"
      style="--border-color: #000"
      :expandable="() => true"
      :render-expand="(row) => h('pre', JSON.stringify(row.original, null, 2))"
    />
    <p>Expanded Keys: {{ expandedKeys }}</p>
    <br>
    <p>Data Table (Array)</p>
    <DataTable
      v-model:checked-row-keys="checkedKeys"
      :columns="columns"
      :data="data"
      :loading="false"
      :row-key="(row) => row._id"
      :pagination="pagination"
      :remote="true"
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
            @click="() => api.setPageIndex(api.pageCount() - 1)"
          >
            »
          </button>
          <span class="pagination-content">
            <div>Total</div>
            <strong>
              {{ api.page + 1 }} of
              {{ api.rowCount() }}
            </strong>
          </span>
        </div>
      </template>
    </DataTable>
    <p>Checked Keys: {{ checkedKeys }}</p>
    <br>
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
