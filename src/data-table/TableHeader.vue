<template>
  <Primitive as="thead" :class="clsx(props.class)" :style="props.style">
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'vue-materials/primitive'
import { clsx } from 'clsx'
import type { CommonProps } from './common.ts'

const props = withDefaults(defineProps<TableHeaderProps>(), {
  class: undefined,
  style: undefined
})

</script>

<script lang="ts">
export interface TableHeaderProps extends CommonProps { }

</script>

<style scoped></style>
