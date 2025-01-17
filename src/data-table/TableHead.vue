<template>
  <Primitive as="th" :class="clsx(props.class)" :style="props.style">
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'vue-materials/primitive'
import { clsx } from 'clsx'
import type { CommonProps } from './common.ts'

const props = withDefaults(defineProps<TableHeadProps>(), {
  class: undefined,
  style: undefined
})

</script>

<script lang="ts">
export interface TableHeadProps extends CommonProps { }

</script>

<style scoped></style>
