<template>
  <TableRow>
    <TableCell :class="clsx(props.class)" :style="props.style" v-bind="delegateProps">
      <div>
        <slot />
      </div>
    </TableCell>
  </TableRow>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { clsx } from 'clsx'
import type { CommonProps } from './common.ts'
import TableCell from './TableCell.vue'
import TableRow from './TableRow.vue'

const props = withDefaults(defineProps<TableEmptyProps>(), {
  colspan: 1
})

const delegateProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

</script>

<script lang="ts">
export interface TableEmptyProps extends CommonProps {
  colspan?: number
}

</script>

<style scoped></style>
