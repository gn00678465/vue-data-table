<script setup lang="ts">
import type { CommonProps } from "./common.ts"
import { clsx } from "clsx"
import { Primitive } from "vue-materials/primitive"

const props = withDefaults(defineProps<TableHeadProps>(), {
  class: undefined,
  style: undefined,
})
</script>

<script lang="ts">
export interface TableHeadProps extends CommonProps { }
</script>

<template>
  <Primitive as="tfoot" :class="clsx(props.class)" :style="props.style">
    <slot />
  </Primitive>
</template>

<style scoped></style>
