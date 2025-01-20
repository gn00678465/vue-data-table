<script setup lang="ts">
import type { CommonProps } from "./common.ts"
import { clsx } from "clsx"
import { Primitive } from "vue-materials/primitive"

const props = withDefaults(defineProps<TableRowProps>(), {
  class: undefined,
  style: undefined,
})
</script>

<script lang="ts">
export interface TableRowProps extends CommonProps { }
</script>

<template>
  <Primitive as="tr" :class="clsx(props.class)" :style="props.style">
    <slot />
  </Primitive>
</template>

<style scoped></style>
