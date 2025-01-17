<template>
  <Table>
  </Table>
</template>

<script setup lang="ts" generic="TD extends object">
import { useAttrs } from 'vue'
import type { PropType } from 'vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
  TableEmpty
} from '../table'
import { useVueTable, FlexRender } from '@tanstack/vue-table';

defineOptions({
  name: 'DataTable',
  inheritAttrs: false,
})

const attrs = useAttrs()
const props = defineProps({
  data: {
    type: Array as PropType<TD[]>,
    default: undefined
  }
})

</script>

<script lang="ts">
export interface DataTableProps {
}

</script>

<style scoped></style>
